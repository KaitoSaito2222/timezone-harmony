import { route } from '@/server/http';
import * as polls from '@/server/polls';

type Context = { params: Promise<{ id: string }> };

export const GET = route(async (_req, { params }: Context) => {
  return polls.findOne((await params).id);
});
