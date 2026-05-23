"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { User, Mail, Settings, Menu } from "@deemlol/next-icons";
import LeftMenu from "./_leftMenu";
import MailMenu from "./_mailMenu";
import ProfileMenu from "./_profileMenu";
import SettingMenu from "./_settingMenu";
import { sendmessage } from "../../_serverInteraction/socket";
import { getSessionId } from "../../_serverInteraction/socket";


type SessionHeaderProps = {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  isMailOpen?: boolean;
  onToggleMail?: () => void;
  isUserMenuOpen?: boolean;
  onToggleUserMenu?: () => void;
  isSettingMenuOpen?: boolean;
  onToggleSettings?: () => void;
};

export default function SessionHeader({
  isMenuOpen,
  onToggleMenu,
  isMailOpen,
  onToggleMail,
  isUserMenuOpen,
  onToggleUserMenu,
  isSettingMenuOpen,
  onToggleSettings,
}: SessionHeaderProps) {
    
    
  const [mailNumber, setMailNumber] = useState(0);

  async function fetchMailNumber() {
    try {
      const response = await sendmessage<{ unreadCount: number }>("mail_unreadCount", { sessionID: getSessionId() || "" });
      setMailNumber(response.unreadCount);
    } catch (error) {
      console.error("Error fetching mail number:", error);
    }
  }

  useEffect(() => {
    fetchMailNumber();
  }, []);
    


    return(
        <header className="w-full bg-card p-4 pl-6 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              aria-expanded={isMenuOpen}
              aria-label="Open menu"
              onClick={(e) => {  onToggleMenu(); }}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:cursor-pointer hover:text-primary hover:text-foreground hover:bg-background/60 transition"
            >
              <Menu className="w-4 h-4" />
            </button>

            <LeftMenu open={isMenuOpen} onClose={() => onToggleMenu?.()} />
          </div>

          <Link href="/" className="text-sm uppercase tracking-[0.35em] font-bold"><span className="text-muted-foreground">Neo-</span><span className="text-primary">DnD</span></Link>
        </div>
      <div className="flex items-center">
        <div className="relative ml-6">
          <button
            aria-expanded={isSettingMenuOpen}
            aria-label="Open settings"
            className="text-sm text-muted-foreground uppercase tracking-[0.35em] font-bold hover:cursor-pointer hover:text-primary transition"
            onClick={() => { onToggleSettings?.(); }}
          >
            <Settings className="inline-block w-4 h-4 mr-1" />
          </button>
          <SettingMenu open={isSettingMenuOpen || false} onClose={() => onToggleSettings?.()} />
        </div>
        <div className="relative ml-6">
          <button
            aria-expanded={isMailOpen}
            aria-label="Open mail"
            onClick={(e) => {  onToggleMail?.(); }}
            className="relative text-sm text-muted-foreground uppercase tracking-[0.35em] font-bold hover:cursor-pointer hover:text-primary transition"
          >
            <Mail className="inline-block w-4 h-4 mr-1" />
            {mailNumber > 0 && (
              <span className="absolute -top-2 -right-2 flex text-center items-center justify-center min-w-5 h-5 text-xs font-bold leading-none text-accent-foreground bg-accent rounded-full shadow-md">
                {mailNumber}
              </span>
            )}
          </button>
          <MailMenu open={isMailOpen} onClose={() => onToggleMail?.()} />
        </div>
        <div className="relative ml-6">
          <button
            aria-expanded={isUserMenuOpen}
            aria-label="Open user menu"
            onClick={(e) => {  onToggleUserMenu?.(); }}
            className="text-sm text-muted-foreground uppercase tracking-[0.35em] font-bold hover:cursor-pointer hover:text-primary transition"
          >
            <User className="inline-block w-4 h-4 mr-1" />
          </button>
          <ProfileMenu open={isUserMenuOpen} onClose={() => onToggleUserMenu?.()} />
        </div>
      </div>
      </header>
    )
}