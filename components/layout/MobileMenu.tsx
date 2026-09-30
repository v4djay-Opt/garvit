"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "@/components/ui/Dialog";
import type { NavItem } from "@/lib/content/types";
export function MobileMenu({ items, isOpen, onClose }: { items: NavItem[]; isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return <Dialog id="mobile-menu" open={isOpen} onClose={onClose} title="Navigation" className="navigation-dialog">
    <nav aria-label="Mobile navigation"><ul className="mobile-links">
      {items.filter(item => item.visible).map(item => <li key={item.href}>
        <Link href={item.href} onClick={onClose} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>
      </li>)}
    </ul></nav>
    <p className="eyebrow-footer">Haridwar, Uttarakhand</p>
  </Dialog>;
}
