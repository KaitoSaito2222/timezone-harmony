import { requireUser } from '@/server/auth';
import { route } from '@/server/http';
import * as polls from '@/server/polls';

export const GET = route(async (req) => {
  const user = await requireUser(req);
  return polls.findMine(user.userId);
});
