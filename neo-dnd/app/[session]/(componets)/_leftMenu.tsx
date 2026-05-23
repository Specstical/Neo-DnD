"use client";

import Link from "next/link";
import { Users, LogOut, Menu, Compass, House  } from "@deemlol/next-icons";
import { clearSessionId, getSessionId, sendmessage } from "../../_serverInteraction/socket";
import { useRouter } from "next/navigation";

type LeftMenuProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function LeftMenu({ open = false, onClose }: LeftMenuProps) {
  const router = useRouter();

    async function handleLogout() {
    try {
      await sendmessage<{ success: boolean; message: string }>("account_logout", { sessionID: getSessionId() || "" });
    } catch (error) {
      console.error("Error logging out:", error);
    }

    clearSessionId();
    onClose?.();
    router.push("/");
  }

  return (
    <nav
      aria-label="Main menu"
      aria-hidden={!open}
      onClick={(e) => e.stopPropagation()}
      className={`absolute left-0 top-full mt-2 w-56 rounded-lg border border-border bg-surface shadow-lg z-50 transform motion-safe:transition-all motion-reduce:transition-none duration-200 ease-out ${open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
    >
      <div className="px-4 pb-2 pt-3 text-xs uppercase tracking-[0.28em] text-muted-foreground font-semibold">Menu</div>
      <ul className="flex flex-col gap-1 p-2">
        <li>
          <Link href={'/' + (getSessionId() || "")} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-primary/10 transition" onClick={() => onClose?.()}>
            <House  size={16} className="text-primary" />
            Home
          </Link>
        </li>
        <li>
          {(() => {
            const sid = getSessionId() || "";
            return (
              <Link href={sid ? `/${sid}/character/menu` : "/"} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-primary/10 transition" onClick={() => onClose?.()}>
                <Users size={16} className="text-primary" />
                Characters
              </Link>
            );
          })()}
        </li>
        <li>
          {(() => {
            const sid = getSessionId() || "";
            return (
              <Link href={sid ? `/${sid}/campaign/menu` : "/"} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-primary/10 transition" onClick={() => onClose?.()}>
                <Compass size={16} className="text-primary" />
                Campaigns
              </Link>
            );
          })()}
        </li>
        <li className="border-t border-border my-1"></li>
        <li>
          <button onClick={handleLogout} className="w-full hover:bg-destructive/10 hover:bg-accent/10 flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-destructive transition">
            <LogOut size={16} />
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
}