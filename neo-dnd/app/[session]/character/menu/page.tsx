import Link from "next/link";

export default async function CharacterMenuPage({ params }: { params: { session: string } | Promise<{ session: string }> }) {
  const { session } = await params;
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-8">
      <section className="rounded-2xl border border-border bg-card p-6 shadow">
        <h1 className="text-2xl font-semibold tracking-tight">Character Menu</h1>
        <p className="mt-3 text-sm text-muted-foreground">Start from here: create a new character, or open an existing one.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/${session}/character/creation`} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Create Character
          </Link>
          <Link href={`/${session}`} className="rounded-xl border border-border px-4 py-2 text-sm font-medium">
            Back To Session Hub
          </Link>
        </div>
      </section>
    </main>
  );
}