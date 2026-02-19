import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Use these instead of next/link and next/navigation throughout the app.
// They automatically prepend /ja/ when the current locale is Japanese.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
