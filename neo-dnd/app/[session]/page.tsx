import Link from "next/link";



export default async function SessionPage({ params }: { params: { session: string } | Promise<{ session: string }> }) {
    const { session } = await params;





    return (
        <main className="relative overflow-hidden px-6 py-12 md:px-8 md:py-16">
            

            <section className="relative mx-auto w-full max-w-5xl rounded-3xl border border-border bg-card/90 p-8 shadow-xl shadow-black/10 md:p-10">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Session Hub</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Welcome to your campaign session</h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                    Choose what you want to manage right now. Use the character menu for sheets and progression,
                    or jump into the campaign menu for world, party, and session tools.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    <Link
                        href={`/${session}/character/menu`}
                        className="group rounded-2xl border border-border bg-background/70 p-6 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
                    >
                        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Menu</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Character Menu</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">Create, edit, and view characters for this session.</p>
                        <p className="mt-5 text-sm font-medium text-primary transition group-hover:translate-x-0.5">Open Character Menu &rarr;</p>
                    </Link>

                    <Link
                        href={`/${session}/campaign/menu`}
                        className="group rounded-2xl border border-border bg-background/70 p-6 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
                    >
                        <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Menu</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Campaign Menu</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">Track lore, locations, factions, and current session notes.</p>
                        <p className="mt-5 text-sm font-medium text-primary transition group-hover:translate-x-0.5">Open Campaign Menu &rarr;</p>
                    </Link>
                </div>
            </section>
        </main>
    );
}