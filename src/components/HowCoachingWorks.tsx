export default function HowCoachingWorks() {
  const steps = [
    { n: "01", t: "Assessment", d: "Goals, training history, injuries, lifestyle, schedule." },
    { n: "02", t: "Standards Set", d: "Training days, nutrition expectations, communication." },
    { n: "03", t: "Program Built", d: "Training + nutrition tailored to you.ot a template." },
    { n: "04", t: "Execute & Review", d: "Weekly check-ins. Adjustments based on performance." },
    { n: "05", t: "Progress or Correct", d: "Wins are celebrated. Losses are used." },
  ];

  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs tracking-[0.45em] text-white/60">HOW COACHING WORKS</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
        Tailored approach. Fixed standard.
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {steps.map((s) => (
          <div
            key={s.n}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-7"
          >
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                {s.n}
              </span>
              <h3 className="text-lg font-semibold">{s.t}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
        <p className="text-sm text-white/70">
          <span className="text-white font-semibold">Key rule:</span> the plan adapts to your goals, lifestyle,
          and starting point. <span className="text-white">The standard does not change.</span>
        </p>
      </div>
    </section>
  );
}
