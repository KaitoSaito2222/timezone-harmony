import { z } from 'zod';
import { prisma } from './db';
import { badRequest, notFound } from './http';

const POLL_TTL_DAYS = 60;
const MAX_VOTERS_PER_POLL = 100;

export const createPollSchema = z.object({
  title: z.string().min(1).max(120),
  timezones: z.array(z.string().max(100)).min(1).max(5),
  durationMinutes: z.int().min(5).max(480).nullish(),
  // Candidate start times (UTC ISO 8601)
  options: z.array(z.iso.datetime({ offset: true })).min(1).max(10),
});

export const votePollSchema = z.object({
  voterName: z.string().min(1).max(50),
  // Option ids the voter is available for (may be empty)
  optionIds: z.array(z.guid()).max(10),
});

// Ids of polls created anonymously on this device
export const claimPollsSchema = z.object({
  pollIds: z.array(z.guid()).max(20),
});

type CreatePollInput = z.output<typeof createPollSchema>;
type VotePollInput = z.output<typeof votePollSchema>;
type ClaimPollsInput = z.output<typeof claimPollsSchema>;

const pollInclude = {
  options: {
    orderBy: { position: 'asc' as const },
    include: { votes: { select: { voterName: true } } },
  },
};

async function getActivePoll(id: string) {
  // Ids are uuids; anything else cannot exist, and Prisma would reject it as malformed.
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw notFound('Poll not found');
  const poll = await prisma.meetingPoll.findUnique({ where: { id }, include: pollInclude });
  if (!poll || poll.expiresAt < new Date()) throw notFound('Poll not found');
  return poll;
}

function toResponse(poll: Awaited<ReturnType<typeof getActivePoll>>) {
  return {
    id: poll.id,
    title: poll.title,
    timezones: poll.timezones,
    durationMinutes: poll.durationMinutes,
    createdAt: poll.createdAt,
    expiresAt: poll.expiresAt,
    options: poll.options.map((o) => ({
      id: o.id,
      startsAt: o.startsAt,
      voters: o.votes.map((v) => v.voterName),
    })),
  };
}

export async function create(dto: CreatePollInput, userId?: string) {
  const startTimes = [...new Set(dto.options.map((o) => new Date(o).getTime()))]
    .sort((a, b) => a - b)
    .map((ms) => new Date(ms));

  if (startTimes.some((d) => Number.isNaN(d.getTime()))) {
    throw badRequest('Invalid option time');
  }

  const expiresAt = new Date(Date.now() + POLL_TTL_DAYS * 24 * 60 * 60 * 1000);
  const poll = await prisma.meetingPoll.create({
    data: {
      title: dto.title.trim(),
      timezones: dto.timezones,
      durationMinutes: dto.durationMinutes ?? 60,
      expiresAt,
      userId: userId ?? null,
      options: {
        create: startTimes.map((startsAt, position) => ({ startsAt, position })),
      },
    },
    include: pollInclude,
  });
  return toResponse(poll);
}

export async function findMine(userId: string) {
  return prisma.meetingPoll.findMany({
    where: { userId, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, title: true, createdAt: true },
  });
}

// Attaches anonymously created polls to the signed-in user. Only polls that
// have no owner yet can be claimed, so an existing owner is never overwritten
// (the check and the write happen in a single UPDATE).
export async function claim(userId: string, dto: ClaimPollsInput) {
  const ids = [...new Set(dto.pollIds)];
  if (ids.length === 0) return { claimed: 0 };
  const result = await prisma.meetingPoll.updateMany({
    where: { id: { in: ids }, userId: null },
    data: { userId },
  });
  return { claimed: result.count };
}

export async function findOne(id: string) {
  return toResponse(await getActivePoll(id));
}

export async function vote(id: string, dto: VotePollInput) {
  const poll = await getActivePoll(id);
  const validIds = new Set(poll.options.map((o) => o.id));
  const optionIds = [...new Set(dto.optionIds)];
  if (optionIds.some((optionId) => !validIds.has(optionId))) {
    throw badRequest('Unknown option');
  }

  const voterName = dto.voterName.trim();
  const voters = new Set(poll.options.flatMap((o) => o.votes.map((v) => v.voterName)));
  if (!voters.has(voterName) && voters.size >= MAX_VOTERS_PER_POLL) {
    throw badRequest('This poll has reached its voter limit');
  }

  // Replace the voter's previous answers so re-voting under the same name edits them.
  await prisma.$transaction([
    prisma.pollVote.deleteMany({ where: { voterName, option: { pollId: id } } }),
    prisma.pollVote.createMany({ data: optionIds.map((optionId) => ({ optionId, voterName })) }),
  ]);

  return toResponse(await getActivePoll(id));
}
