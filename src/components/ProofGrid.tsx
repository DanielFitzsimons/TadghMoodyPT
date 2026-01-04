export default function ProofGrid() {
  const tiles = [
    { k: "+20kg", v: "4 years", d: "Sustained progress, not shortcuts." },
    { k: "3–5", v: "days/week", d: "Consistency beats novelty." },
    { k: "Weekly", v: "check-ins", d: "Adjust based on performance." },
    { k: "Logged", v: "lifts", d: "If it isn’t tracked, it isn’t controlled." },
  ];

  return (
    <section id="proof" className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs tracking-[0.45em] text-white/60">PROOF</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
        Quiet confidence. Clear outcomes.
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {tiles.map((t) => (
          <div key={t.k} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-semibold">{t.k}</p>
              <p className="text-xs tracking-[0.35em] text-white/60 uppercase">{t.v}</p>
            </div>
            <p className="mt-4 text-sm text-white/70">{t.d}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-white/45">
        Replace these tiles with real transformations & testimonials when you have assets.
      </p>
    </section>
  );
}
