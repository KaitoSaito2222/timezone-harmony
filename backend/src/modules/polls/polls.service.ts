import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';
import { ClaimPollsDto } from './dto/claim-polls.dto';

const POLL_TTL_DAYS = 60;
const MAX_VOTERS_PER_POLL = 100;

const pollInclude = {
  options: {
    orderBy: { position: 'asc' as const },
    include: { votes: { select: { voterName: true } } },
  },
};

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePollDto, userId?: string) {
    const startTimes = [...new Set(dto.options.map((o) => new Date(o).getTime()))]
      .sort((a, b) => a - b)
      .map((ms) => new Date(ms));

    if (startTimes.some((d) => Number.isNaN(d.getTime()))) {
      throw new BadRequestException('Invalid option time');
    }

    const expiresAt = new Date(Date.now() + POLL_TTL_DAYS * 24 * 60 * 60 * 1000);
    const poll = await this.prisma.meetingPoll.create({
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
    return this.toResponse(poll);
  }

  async findMine(userId: string) {
    const polls = await this.prisma.meetingPoll.findMany({
      where: { userId, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { id: true, title: true, createdAt: true },
    });
    return polls;
  }

  // Attaches anonymously created polls to the signed-in user. Only polls that
  // have no owner yet can be claimed, so an existing owner is never overwritten
  // (the check and the write happen in a single UPDATE).
  async claim(userId: string, dto: ClaimPollsDto) {
    const ids = [...new Set(dto.pollIds)];
    if (ids.length === 0) return { claimed: 0 };
    const result = await this.prisma.meetingPoll.updateMany({
      where: { id: { in: ids }, userId: null },
      data: { userId },
    });
    return { claimed: result.count };
  }

  async findOne(id: string) {
    return this.toResponse(await this.getActivePoll(id));
  }

  async vote(id: string, dto: VotePollDto) {
    const poll = await this.getActivePoll(id);
    const validIds = new Set(poll.options.map((o) => o.id));
    const optionIds = [...new Set(dto.optionIds)];
    if (optionIds.some((optionId) => !validIds.has(optionId))) {
      throw new BadRequestException('Unknown option');
    }

    const voterName = dto.voterName.trim();
    const voters = new Set(poll.options.flatMap((o) => o.votes.map((v) => v.voterName)));
    if (!voters.has(voterName) && voters.size >= MAX_VOTERS_PER_POLL) {
      throw new BadRequestException('This poll has reached its voter limit');
    }

    // Replace the voter's previous answers so re-voting under the same name edits them.
    await this.prisma.$transaction([
      this.prisma.pollVote.deleteMany({
        where: { voterName, option: { pollId: id } },
      }),
      this.prisma.pollVote.createMany({
        data: optionIds.map((optionId) => ({ optionId, voterName })),
      }),
    ]);

    return this.toResponse(await this.getActivePoll(id));
  }

  private async getActivePoll(id: string) {
    // Ids are uuids; anything else cannot exist, and Prisma would reject it as malformed.
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new NotFoundException('Poll not found');
    const poll = await this.prisma.meetingPoll.findUnique({
      where: { id },
      include: pollInclude,
    });
    if (!poll || poll.expiresAt < new Date()) {
      throw new NotFoundException('Poll not found');
    }
    return poll;
  }

  private toResponse(poll: Awaited<ReturnType<PollsService['getActivePoll']>>) {
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
}
