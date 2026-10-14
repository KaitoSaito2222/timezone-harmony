import { parseBody, route } from '@/server/http';
import * as polls from '@/server/polls';

type Context = { params: Promise<{ id: string }> };

export const POST = route(async (req, { params }: Context) => {
  const dto = await parseBody(req, polls.votePollSchema);
  return polls.vote((await params).id, dto);
});
