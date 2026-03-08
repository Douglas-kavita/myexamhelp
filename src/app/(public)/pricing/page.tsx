import Link from "next/link";

export default function PricingPage() {
  const tiers = [
    { name: "Starter", price: "$10+", points: ["Quick questions", "Short tasks", "Basic explanations"] },
    { name: "Standard", price: "$25+", points: ["Assignments & prep", "Structured solutions", "Formatting support"], hot: true },
    { name: "Pro", price: "$50+", points: ["Projects & reports", "Data analysis guidance", "Polished outputs"] },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Pricing</h1>
        <p className="mt-2 text-sm opacity-70">
          Starting points — final pricing depends on complexity & urgency.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={[
              "rounded-2xl border p-6 shadow-sm",
              "border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900",
              t.hot ? "ring-2 ring-black/10 dark:ring-white/10" : "",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold">{t.name}</div>
              {t.hot && (
                <span className="rounded-full border border-black/10 bg-black/5 px-2 py-1 text-xs font-semibold dark:border-white/10 dark:bg-white/5">
                  Most popular
                </span>
              )}
            </div>
            <div className="mt-3 text-3xl font-semibold">{t.price}</div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm opacity-70">
              {t.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-5 inline-flex w-full justify-center rounded-xl border border-black/10 bg-black/5 px-4 py-2 font-semibold hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              Choose {t.name}
            </Link>
          </div>
        ))}
      </div>

      <p className="text-sm opacity-70">
        Note: We provide educational support and guidance. Always follow your institution’s rules and academic integrity policies.
      </p>
    </div>
  );
}
