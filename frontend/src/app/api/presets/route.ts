import { requireUser } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import * as presets from '@/server/presets';

export const GET = route(async (req) => {
  const user = await requireUser(req);
  return presets.findAllByUser(user.userId);
});

export const POST = route(async (req) => {
  const user = await requireUser(req);
  const dto = await parseBody(req, presets.createPresetSchema);
  return presets.create(user.userId, dto);
});
