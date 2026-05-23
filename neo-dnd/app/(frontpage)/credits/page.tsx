"use client";

const credits = [
    {
        title: "Project",
        items: ["Neo-DnD", "A modern companion app for Dungeons & Dragons players and Dungeon Masters."],
    },
    {
        title: "Built With",
        items: ["Next.js", "TypeScript", "Socket.IO", "Mongoose", "Tailwind CSS"],
    },
    {
        title: "Thanks",
        items: ["D&D players and DMs", "Open-source tools", "Anyone helping shape the game"],
    },
];

export default function CreditPage() {
    return (
        <main className="min-h-screen w-full bg-background px-6 py-10 text-foreground md:px-8">
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-border bg-surface/60 p-6 shadow-lg shadow-black/5 md:p-10">
                <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">About</p>
                    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Neo-D&D</h1>
                    <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                        Neo-D&D is a work-in-progress tabletop companion designed to keep the important parts of a campaign in one place.
                        It is meant to help organize characters, lore, sessions, and game tools without getting in the way of the game itself.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {credits.map((group) => (
                        <article key={group.title} className="rounded-2xl border border-border bg-background/60 p-5">
                            <h2 className="text-lg font-semibold">{group.title}</h2>
                            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                                {group.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>

                <div className="grid gap-4 rounded-2xl border border-border bg-background/60 p-5 md:grid-cols-2">
                    <div>
                        <h2 className="text-lg font-semibold">Purpose</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            This page can be expanded into a full about page, credits page, or changelog depending on how you want to present the project.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Next Steps</h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Add team names, contributor links, art credits, or a short project history here as the app grows.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}