"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RULES = [
  {
    n: "01",
    title: "Accountability",
    line: "Half effort only delays disappointment.",
    body:
      "If you can’t follow steps consistently, no blueprint will save you. We build structure, you do the work.",
  },
  {
    n: "02",
    title: "Commit properly",
    line: "Real change is months — not motivation weeks.",
    body:
      "Stop expecting a transformation from inconsistent weeks. We commit. We execute. We review.",
  },
  {
    n: "03",
    title: "Progress is controlled",
    line: "Fast gains are often just fast regret.",
    body:
      "We chase sustainable progress. Enough to move forward, not enough to spiral into dieting sooner.",
  },
  {
    n: "04",
    title: "Stop changing plans weekly",
    line: "Consistency beats novelty — every time.",
    body:
      "Pick a plan that fits your life and run it long enough to measure it. Your training must complement your lifestyle.",
  },
  {
    n: "05",
    title: "Log lifts",
    line: "If it isn’t tracked, it isn’t controlled.",
    body:
      "We log performance week to week. Getting stronger with good form is the simplest indicator you’re building something real.",
  },
  {
    n: "06",
    title: "Be patient",
    line: "Results don’t rush for anyone.",
    body:
      "This is a long game. The goalposts move — learn to love the process and stay driven by the day-to-day.",
  },
  {
    n: "07",
    title: "Stop chasing the pump",
    line: "The reps that matter are the ones before failure.",
    body:
      "The stimulus happens when it gets hard. If you always have reps in the tank, you’re not giving your body a reason to adapt.",
  },
  {
    n: "08",
    title: "Sleep like it matters",
    line: "Recovery is training.",
    body:
      "Your performance depends on what you do outside the gym. Sleep, nutrition, and routine are non-negotiable.",
  },
];

export default function StandardCards() {
  const root = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".std-card");

      cards.forEach((card) => {
        gsap.set(card, { opacity: 0, y: 16 });

        ScrollTrigger.create({
          trigger: card,
          start: "top 78%",
          end: "bottom 50%",
          onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }),
          onLeaveBack: () => gsap.to(card, { opacity: 0, y: 16, duration: 0.4, ease: "power2.out" }),
        });
      });

      // Progress line
      const bar = document.querySelector(".std-progress-fill");
      if (bar) {
        gsap.set(bar, { scaleY: 0, transformOrigin: "top" });

        ScrollTrigger.create({
          trigger: "#standard",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => gsap.to(bar, { scaleY: self.progress, duration: 0.1, ease: "none" }),
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="standard" ref={root} className="relative mx-auto max-w-6xl px-5 py-20">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.45em] text-white/60">THE STANDARD</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Rules are simple. Execution isn’t.
          </h2>
        </div>
        <p className="max-w-md text-sm text-white/60">
          This is the doctrine. The approach adapts. The standard does not.
        </p>
      </div>

      {/* Progress rail */}
      <div className="pointer-events-none absolute left-2 top-0 hidden h-full w-px bg-white/10 md:block">
        <div className="std-progress-fill h-full w-px bg-white/50" />
      </div>

      <div className="grid gap-6 md:gap-7">
        {RULES.map((r) => (
          <article
            key={r.n}
            className="std-card group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-9"
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex items-baseline gap-4">
                <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs tracking-[0.35em] text-white/70">
                  {r.n}
                </span>
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{r.title}</h3>
              </div>

              <p className="max-w-xl text-sm text-white/70 md:text-base">{r.line}</p>
            </div>

            <div className="relative mt-6 border-t border-white/10 pt-6">
              <p className="max-w-4xl text-sm leading-relaxed text-white/65 md:text-base">
                {r.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
