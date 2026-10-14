import { optionalUser } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import * as polls from '@/server/polls';

// Reading and voting are public on purpose: the poll id is the link secret shared
// with participants. Creating works anonymously, and records the owner when a
// valid token is sent. "mine" and "claim" require a signed-in user.
export const POST = route(async (req) => {
  const dto = await parseBody(req, polls.createPollSchema);
  const user = await optionalUser(req);
  return polls.create(dto, user?.userId);
});
