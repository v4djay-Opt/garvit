"use client";

import { useEffect, useRef, type ReactNode, type KeyboardEvent } from "react";

/** Native modal keeps background inert, traps Tab and restores trigger focus. */
export function Dialog({ open, onClose, title, children, className = "", id, onKeyDown, label }: {
  open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; className?: string; id?: string; onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void; label?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, [open]);
  return <dialog ref={ref} id={id}
    {...(label ? { "aria-label": label } : { "aria-labelledby": `${id ?? "dialog"}-title` })}
    className={`site-dialog ${className}`}
    onKeyDown={(event) => {
      onKeyDown?.(event);
      if (event.key !== "Tab") return;
      const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
      if (!elements.length) { event.preventDefault(); return; }
      event.preventDefault();
      const current = elements.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey ? (current <= 0 ? elements.length - 1 : current - 1) : (current + 1) % elements.length;
      elements[next].focus();
    }}
    onCancel={(event) => { event.preventDefault(); closeRef.current(); }}
    onClick={(event) => { if (event.target === event.currentTarget) closeRef.current(); }}>
    {open && <div className="dialog-surface">
      <div className="dialog-heading"><h2 className="text-h3" id={`${id ?? "dialog"}-title`}>{title}</h2>
        <button type="button" className="plain-button" onClick={onClose} aria-label="Close dialog">Close <span aria-hidden>×</span></button>
      </div>
      {children}
    </div>}
  </dialog>;
}
