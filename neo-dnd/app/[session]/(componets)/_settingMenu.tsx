
"use client";

import Link from "next/link";
import { Settings, User, ChevronLeft } from "@deemlol/next-icons";
import { getSessionId } from "../../_serverInteraction/socket";

export default function SettingMenu({ open = false, onClose }: { open?: boolean; onClose: () => void }) {
    const sessionId = getSessionId() || "";

    return (
        <nav
            aria-label="Settings menu"
            aria-hidden={!open}
            onClick={(e) => e.stopPropagation()}
            className={`absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-border bg-surface shadow-lg transform motion-safe:transition-all motion-reduce:transition-none duration-200 ease-out ${open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
        >
            <div className="border-b border-border px-4 py-3">
                <p className="text-xs uppercase tracking-[0.35em] font-bold text-primary">Settings</p>
            </div>
            <ul className="flex flex-col gap-0.5 p-2">
                <li>
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-primary/10 transition"
                        onClick={onClose}
                    >
                        <Settings size={16} className="text-primary flex-shrink-0" />
                        Theme Settings
                    </Link>
                </li>
            </ul>
        </nav>
    );
}