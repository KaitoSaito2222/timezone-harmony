import { requireUser } from '@/server/auth';
import { route } from '@/server/http';
import * as presets from '@/server/presets';

type Context = { params: Promise<{ id: string }> };

export const POST = route(async (req, { params }: Context) => {
  const user = await requireUser(req);
  return presets.toggleFavorite((await params).id, user.userId);
});
