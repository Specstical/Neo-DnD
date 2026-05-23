import Link from "next/link";
import Footer from "../(componets)/_footer";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="w-full bg-card p-4 pl-6 flex items-center justify-left">
        <Link
          href="/"
          className="text-sm uppercase tracking-[0.35em] font-bold"
        >
          <span className="text-muted-foreground">Neo-</span>
          <span className="text-primary">DnD</span>
        </Link>
        <Link
          href="/login"
          className="ml-6 text-sm text-muted-foreground uppercase tracking-[0.35em] font-bold hover:text-primary transition"
        >
          Start
        </Link>
        <Link
          href="/settings"
          className="ml-6 text-sm text-muted-foreground uppercase tracking-[0.35em] font-bold hover:text-primary transition"
        >
          Settings
        </Link>
        <Link
          href="/credits"
          className="ml-6 text-sm text-muted-foreground uppercase tracking-[0.35em] font-bold hover:text-primary transition"
        >
          Credits
        </Link>
      </header>
      <div className="pointer-events-none absolute inset-0 opacity-70 w-screen h-screen">
        <div className="absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-[#B34B47]/15 blur-3xl" />
        <div className="absolute bottom-[-7rem] right-[-6rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {children}
      <Footer />
    </>
  );
}
