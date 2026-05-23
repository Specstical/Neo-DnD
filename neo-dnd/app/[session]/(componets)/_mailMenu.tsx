"use client";

type MailMenuProps = {
  open?: boolean;
  onClose: () => void;
};

import { useRouter } from "next/navigation";
import { getSessionId } from "@/app/_serverInteraction/socket";
import { Inbox, Edit } from "@deemlol/next-icons";

export default function MailMenu({ open = false, onClose }: MailMenuProps) {
  const router = useRouter();
  return (
    <nav
      aria-label="Mail menu"
      aria-hidden={!open}
      onClick={(e) => e.stopPropagation()}
      className={`absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-border bg-surface shadow-lg transform motion-safe:transition-all motion-reduce:transition-none duration-200 ease-out ${open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
    >
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs uppercase tracking-[0.35em] font-bold text-primary">Mail</p>
      </div>
      <ul className="flex flex-col gap-0.5 p-2">
        <li>
          <button
            type="button"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-primary/10 transition"
            onClick={(e) => {
              e.stopPropagation();
              const sid = getSessionId() || "";
              onClose();
              router.push(sid ? `/${sid}/mail/inbox` : "/");
            }}
          >
            <Inbox size={16} className="text-primary flex-shrink-0" />
            <span>Inbox</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-primary/10 transition"
            onClick={(e) => {
              e.stopPropagation();
              const sid = getSessionId() || "";
              onClose();
              router.push(sid ? `/${sid}/mail/inbox` : "/");
            }}
          >
            <Edit size={16} className="text-accent flex-shrink-0" />
            <span>Compose</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
