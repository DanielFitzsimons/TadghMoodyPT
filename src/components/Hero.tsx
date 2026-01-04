"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-reveal", { opacity: 0, y: 12 });
      gsap.set(".hero-cta", { opacity: 0, y: 10 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-reveal", { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0)
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.7 }, 0.8);

      gsap.to(".hero-sweep", {
        xPercent: 120,
        duration: 6,
        repeat: -1,
        ease: "none",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-[92vh] items-center justify-center px-5 pt-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.10),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,1))]" />

      {/* Light sweep */}
      <div className="pointer-events-none absolute left-[-30%] top-0 -z-10 h-full w-[40%] skew-x-[-16deg] bg-white/5 blur-2xl hero-sweep" />

      <div className="mx-auto w-full max-w-4xl text-center">
        <p className="hero-reveal text-xs tracking-[0.45em] text-white/60">
          APPLICATION-ONLY • NO TEMPLATES • NO SHORTCUTS
        </p>

        <h1 className="hero-reveal mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
          YOU <span className="text-white/50">vs</span> YOU
        </h1>

        <p className="hero-reveal mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          Coaching built around the individual.
          <span className="text-white"> The standard does not change.</span>
        </p>

        <div className="hero-cta mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/apply"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-white/90"
          >
            Apply for Coaching
          </Link>
          <Link
            href="/#standard"
            className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white/80 hover:border-white/40 hover:text-white"
          >
            See the Standard
          </Link>
        </div>

        <p className="hero-reveal mt-10 text-xs text-white/45">
          Limited Spaces Available.
        </p>
      </div>
    </section>
  );
}
