import { requireUser } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import * as presets from '@/server/presets';

type Context = { params: Promise<{ id: string }> };

export const GET = route(async (req, { params }: Context) => {
  const user = await requireUser(req);
  return presets.findById((await params).id, user.userId);
});

export const PUT = route(async (req, { params }: Context) => {
  const user = await requireUser(req);
  const dto = await parseBody(req, presets.updatePresetSchema);
  return presets.update((await params).id, user.userId, dto);
});

export const DELETE = route(async (req, { params }: Context) => {
  const user = await requireUser(req);
  await presets.remove((await params).id, user.userId);
});
