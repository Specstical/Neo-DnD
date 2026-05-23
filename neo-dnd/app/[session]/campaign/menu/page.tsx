import Link from "next/link";

export default async function CampaignMenuPage({ params }: { params: { session: string } | Promise<{ session: string }> }) {
  const { session } = await params;
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-8">
      <section className="rounded-2xl border border-border bg-card p-6 shadow">
        <h1 className="text-2xl font-semibold tracking-tight">Campaign Menu</h1>
        <p className="mt-3 text-sm text-muted-foreground">Use this area for campaign-level tools like lore, notes, and timeline data.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/${session}`} className="rounded-xl border border-border px-4 py-2 text-sm font-medium">
            Back To Session Hub
          </Link>
        </div>
      </section>
    </main>
  );
}