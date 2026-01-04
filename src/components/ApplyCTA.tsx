import Link from "next/link";

export default function ApplyCTA() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs tracking-[0.45em] text-white/60">APPLICATION</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
              This is not a purchase. It’s an application.
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Your answers are used to build your approach. If accepted, you’ll receive coaching built around you —
              not a template.
            </p>
          </div>

          <Link
            href="/apply"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-white/90"
          >
            Begin Application
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/45">Not everyone is accepted.</p>
      </div>
    </section>
  );
}
