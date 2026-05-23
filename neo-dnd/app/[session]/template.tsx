"use client";

import Footer from "../(componets)/_footer";
import { useState, useEffect, use } from "react";
import SessionHeader from "./(componets)/_header";
import { getSessionId } from "../_serverInteraction/socket";
import { useRouter } from "next/navigation";
import { sendmessage } from "../_serverInteraction/socket";
import UsernamePick from "./(componets)/_usernamePick";

export default function Template({ children }: { children: React.ReactNode }) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingMenuOpen, setIsSettingMenuOpen] = useState(false);
  const [hasUsername, setHasUsername] = useState(true);
  const router = useRouter();

  function toggleMenu() {
    setIsMenuOpen((open) => !open);
  }

  function toggleMail() {
    setIsMailOpen((open) => !open);
  }

  function toggleUserMenu() {
    setIsUserMenuOpen((open) => !open);
  }

  function toggleSettings() {
    setIsSettingMenuOpen((open) => !open);
  }

  useEffect(() => {
    async function checkSession() {
      const sessionId = getSessionId();
      if (!sessionId) {
        router.push("/");
        return;
      }
      if (sessionId && !window.location.pathname.includes(sessionId)) {
        router.push(`/${sessionId}`);
      }
    }

    checkSession();

    async function checkUsername() {
      try {
        const response = await sendmessage<{ success: boolean; results: Array<{ username: string }> }>("data_lookup", { 
          sessionID: getSessionId() || "", 
          dataType: "User", 
          filter: { sessionID: getSessionId(), username: { $exists: true, $ne: "" } }
        });
        setHasUsername(response.success && response.results.length > 0);
        
      } catch (error) {
        setHasUsername(false);
        router.push("/");
      }
    }
    checkUsername();

    

  }, [ hasUsername ]);


  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground "
      onClick={() => {
        if (isMenuOpen) setIsMenuOpen(false);
        if (isMailOpen) setIsMailOpen(false);
        if (isUserMenuOpen) setIsUserMenuOpen(false);
        if (isSettingMenuOpen) setIsSettingMenuOpen(false);
      }}
    >
        {!hasUsername ? (
            <UsernamePick hasUsername={hasUsername} setHasUsername={setHasUsername} />
        ) : null}


          <SessionHeader
            isMenuOpen={isMenuOpen}
            onToggleMenu={toggleMenu}
            isMailOpen={isMailOpen}
            onToggleMail={toggleMail}
        isUserMenuOpen={isUserMenuOpen}
        onToggleUserMenu={toggleUserMenu}
        isSettingMenuOpen={isSettingMenuOpen}
        onToggleSettings={toggleSettings}
      />

      <div className="pointer-events-none absolute inset-0 opacity-60 w-screen min-h-screen overflow-hidden">
                <div className="absolute left-[-6rem] top-[-5rem] h-56 w-56 rounded-full bg-primary/15 blur-3xl z-0" />
                <div className="absolute bottom-[-2rem] right-[-6rem] h-64 w-64 rounded-full bg-[#B34B47]/15 blur-3xl z-0" />
            </div>
      <div className="flex-1 w-full">{children}</div>

      <Footer />
    </div>
  );
}