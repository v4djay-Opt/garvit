/**
 * lib/utils/cn.ts
 * Simple class-name merger without a heavy dependency.
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
