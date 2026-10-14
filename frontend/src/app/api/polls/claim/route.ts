import { requireUser } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import * as polls from '@/server/polls';

export const POST = route(async (req) => {
  const user = await requireUser(req);
  const dto = await parseBody(req, polls.claimPollsSchema);
  return polls.claim(user.userId, dto);
});
