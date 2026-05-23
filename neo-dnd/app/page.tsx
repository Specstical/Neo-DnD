import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-3xl border border-border bg-surface p-8 shadow-lg shadow-black/5 md:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-muted">Neo-DnD</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            The <span className="font-bold italic text-primary">Next Generation</span> of <span className="font-bold text-[#B34B47]">Dungeons & Dragons</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg">
            A modern, all in one app for Dungeons & Dragons players and Dungeon Masters.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            <Link
              href="/login"
              className="rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Start
            </Link>
            <Link
              href="/settings"
              className="rounded-2xl border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              Settings
            </Link>
            <Link
              href="/credits"
              className="rounded-2xl border border-border bg-background px-5 py-3 font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              Credits
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
