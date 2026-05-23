"use client";

import Link from "next/link";
import { Settings, User, LogOut } from "@deemlol/next-icons";
import { useRouter } from "next/navigation";
import { clearSessionId, getSessionId } from "../../_serverInteraction/socket";

type ProfileMenuProps = {
  open?: boolean;
  onClose: () => void;
};

export default function ProfileMenu({ open = false, onClose }: ProfileMenuProps) {
  const router = useRouter();

  function handleLogout() {
    clearSessionId();
    onClose();
    router.push("/");
  }

  return (
    <nav
      aria-label="Profile menu"
      aria-hidden={!open}
      onClick={(e) => e.stopPropagation()}
      className={`absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-surface shadow-lg transform motion-safe:transition-all motion-reduce:transition-none duration-200 ease-out ${open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
    >
      <div className="px-4 pb-2 pt-3 text-xs uppercase tracking-[0.28em] text-muted-foreground font-semibold">
        Profile
      </div>
      <ul className="flex flex-col gap-1 p-2">
        <li>
          <Link href={`/${getSessionId()}/profile`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-primary/10 transition" onClick={onClose}>
            <User size={16} className="text-primary" />
            Profile
          </Link>
        </li>
        <li>
          <Link href={`/${getSessionId()}/settings`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-primary/10 transition" onClick={onClose}>
            <Settings size={16} className="text-primary" />
            Settings
          </Link>
        </li>
        <li className="border-t border-border my-1"></li>
        <li>
          <button type="button" className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition" onClick={handleLogout}>
            <LogOut size={16} />
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
}