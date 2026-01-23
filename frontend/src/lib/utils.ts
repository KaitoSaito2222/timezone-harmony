import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and merges Tailwind CSS classes intelligently
 * - clsx: Conditionally joins classNames together
 * - twMerge: Merges Tailwind CSS classes and resolves conflicts (e.g., 'px-2 px-4' becomes 'px-4')
 * @param inputs - Class values to be combined
 * @returns Merged class string
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', { 'text-white': isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
