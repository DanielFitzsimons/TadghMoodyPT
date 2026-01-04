export default function FitFilter() {
  const yes = [
    "You want structure, not hype",
    "You can commit to set training days",
    "You’ll track progress",
    "You understand results take time",
  ];
  const no = [
    "You want motivation without accountability",
    "You change plans every week",
    "You want shortcuts",
    "You disappear when it gets hard",
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs tracking-[0.45em] text-white/60">FILTER</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
        This is for serious people.
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
          <h3 className="text-lg font-semibold">For you if</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {yes.map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7">
          <h3 className="text-lg font-semibold">Not for you if</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            {no.map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-white/30" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
