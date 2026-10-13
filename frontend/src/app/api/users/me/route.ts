import { requireUser } from '@/server/auth';
import { route } from '@/server/http';
import { getProfile } from '@/server/users';

export const GET = route(async (req) => {
  const user = await requireUser(req);
  return getProfile(user.userId);
});
