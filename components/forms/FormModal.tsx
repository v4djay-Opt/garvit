"use client";
import type { ReactNode } from "react";
import { Dialog } from "@/components/ui/Dialog";
export function FormModal({ isOpen, onClose, title, children }: {
  isOpen: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  return <Dialog open={isOpen} onClose={onClose} title={title}>{children}</Dialog>;
}
