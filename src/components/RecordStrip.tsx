export default function RecordStrip() {
  const items = [
    "Army-trained",
    "Hyrox competitor",
    "Ironman finisher",
    "Strength • Hypertrophy • Performance",
    "Structure > Motivation",
  ];

  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-6 text-xs text-white/70">
        {items.map((t) => (
          <span key={t} className="tracking-[0.25em] uppercase">
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}
