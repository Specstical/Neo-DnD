"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { sendmessage, getSessionId } from "../_serverInteraction/socket";
import { useRouter } from "next/navigation";



interface AuthCardProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerHref: string;
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  isValidEmail: (email: string) => boolean;
  onSubmit: (e: FormEvent) => void;
}

export function AuthCard({
  title,
  subtitle,
  submitLabel,
  footerText,
  footerLinkLabel,
  footerHref,
  email,
  password,
  setEmail,
  setPassword,
  isValidEmail,
  onSubmit,
}: AuthCardProps) {

    const router = useRouter();

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const response = await sendmessage<{ success: boolean; message: string; userId?: string }>(
                  "account_autoLogin",
                  { sessionID: getSessionId() || "" }
                );
                if (response.success && response.userId) {
                  const sid = getSessionId() || "";
                  router.push(sid ? `/${sid}` : "/");
                    
                }
                else {
                    console.log("Auto-login not successful:", response.message);
                }
            } catch (error) {
                console.error("Auto-login failed:", error);
            }
        };

        autoLogin();
    }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(179,75,71,0.18),_transparent_35%),linear-gradient(180deg,_var(--background)_0%,_rgba(255,255,255,0.02)_100%)] px-6 py-10 text-foreground md:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-[#B34B47]/15 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-[-6rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-2xl shadow-black/10 backdrop-blur sm:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden flex-col justify-between border-r border-border/70 bg-[linear-gradient(160deg,_rgba(179,75,71,0.12),_rgba(0,0,0,0)_55%)] p-8 sm:flex lg:p-10">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Neo-DnD
              </Link>
              <h2 className="mt-6 max-w-sm text-4xl font-semibold tracking-tight lg:text-5xl">{title}</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground lg:text-base">
                {subtitle}
              </p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Secure account access
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#B34B47]" />
                Shared layout for login and signup
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-foreground/60" />
                Easy to restyle from one place
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center gap-3 sm:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                ND
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Neo-DnD</p>
                <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              </div>
            </div>

            <h1 className="hidden text-3xl font-semibold tracking-tight sm:block">{title}</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground sm:mt-4">
              {subtitle}
            </p>

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground/90">
                  Email
                </label>
                <div className="rounded-2xl border border-border bg-background/80 px-4 py-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                {email && !isValidEmail(email) && (
                  <p className="text-sm text-red-500">Please enter a valid email address.</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground/90">
                  Password
                </label>
                <div className="rounded-2xl border border-border bg-background/80 px-4 py-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <input
                    type="password"
                    id="password"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={submitLabel === "Sign Up" ? "new-password" : "current-password"}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 hover:cursor-pointer hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {submitLabel}
                <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {footerText}{" "}
              <Link href={footerHref} className="font-medium text-primary hover:underline">
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}