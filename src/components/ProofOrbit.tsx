"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type OrbitNode = {
  id: string;
  k: string;
  v: string;
  d: string;
  x: number;
  y: number;
  r?: number;
  xm?: number;
  ym?: number;
};

export default function ProofOrbit() {
  const root = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const lineRefs = useRef<Record<string, SVGLineElement | null>>({});
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const nodes: OrbitNode[] = useMemo(
    () => [
      { id: "n1", k: "+20kg", v: "4 years", d: "Sustained progress. No shortcuts.", x: -220, y: -140, r: -6, xm: -120, ym: -140 },
      { id: "n2", k: "3–5", v: "days/week", d: "Consistency beats novelty.", x: 220, y: -120, r: 8, xm: 120, ym: -120 },
      { id: "n3", k: "Weekly", v: "check-ins", d: "Adjust based on performance.", x: -250, y: 120, r: 10, xm: -130, ym: 140 },
      { id: "n4", k: "Logged", v: "lifts", d: "If it isn’t tracked, it isn’t controlled.", x: 240, y: 160, r: -10, xm: 130, ym: 160 },
      { id: "n5", k: "Tailored", v: "approach", d: "Built around you. Standard stays fixed.", x: 0, y: -210, r: 0, xm: 0, ym: -210 },
    ],
    []
  );

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const stage = stageRef.current;
      const center = centerRef.current;
      const svg = svgRef.current;
      if (!stage || !center || !svg) return;

      const nodeEls = nodes
        .map((n) => nodeRefs.current[n.id])
        .filter(Boolean) as HTMLDivElement[];

      const lineEls = nodes
        .map((n) => lineRefs.current[n.id])
        .filter(Boolean) as SVGLineElement[];

      const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

      const coords = (i: number) => {
        const n = nodes[i];
        return {
          x: isMobile() ? n.xm ?? Math.round(n.x * 0.45) : n.x,
          y: isMobile() ? n.ym ?? Math.round(n.y * 0.45) : n.y,
          r: n.r ?? 0,
        };
      };

      // ---------- INIT STYLES (separate from animation) ----------
      const initStyles = () => {
        gsap.set(center, { opacity: 0, scale: 0.96, filter: "blur(10px)" });

        nodeEls.forEach((el) => {
          gsap.set(el, { opacity: 0, x: 0, y: 0, scale: 0.92, rotate: 0 });
          // safety: ensure nodes sit above everything
          el.style.zIndex = "30";
        });

        // lines are behind nodes, above background
        lineEls.forEach((l) => {
          gsap.set(l, { opacity: 0 });
          l.style.strokeDasharray = "999";
          l.style.strokeDashoffset = "999";
        });
      };

      // ---------- LINE UPDATER ----------
      const updateLines = () => {
        const stageRect = stage.getBoundingClientRect();
        const cRect = center.getBoundingClientRect();

        const cx = cRect.left + cRect.width / 2 - stageRect.left;
        const cy = cRect.top + cRect.height / 2 - stageRect.top;

        nodes.forEach((n) => {
          const nodeEl = nodeRefs.current[n.id];
          const lineEl = lineRefs.current[n.id];
          if (!nodeEl || !lineEl) return;

          const r = nodeEl.getBoundingClientRect();
          const nx = r.left + r.width / 2 - stageRect.left;
          const ny = r.top + r.height / 2 - stageRect.top;

          lineEl.setAttribute("x1", `${cx}`);
          lineEl.setAttribute("y1", `${cy}`);
          lineEl.setAttribute("x2", `${nx}`);
          lineEl.setAttribute("y2", `${ny}`);
        });
      };

      // Run once initially so lines have a sane start
      initStyles();
      updateLines();

      // ---------- TIMELINES (separate, no scrub) ----------
      const centerTL = gsap.timeline({ paused: true });
      centerTL.to(center, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "power3.out",
      });

      const nodesTL = gsap.timeline({ paused: true });
      nodeEls.forEach((el, i) => {
        nodesTL.to(
          el,
          {
            opacity: 1,
            x: () => coords(i).x,
            y: () => coords(i).y,
            rotate: () => coords(i).r,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
            onUpdate: updateLines,
          },
          i === 0 ? 0 : "-=0.48" // overlap for “deployment” feel
        );
      });

      // Micro drift after deploy (subtle life)
      nodeEls.forEach((el, i) => {
        nodesTL.to(
          el,
          {
            y: () => coords(i).y + (i % 2 === 0 ? 10 : -10),
            duration: 0.9,
            ease: "sine.inOut",
            onUpdate: updateLines,
          },
          ">-0.25"
        );
      });

      const linesTL = gsap.timeline({ paused: true });
      linesTL.to(lineEls, { opacity: 1, duration: 0.2, ease: "none" }, 0);
      linesTL.to(
        lineEls,
        { strokeDashoffset: 0, duration: 0.8, ease: "power2.out", stagger: 0.06 },
        0.08
      );

      // ---------- SCROLLTRIGGER (plays on enter, not scrub) ----------
      const master = gsap.timeline({ paused: true });
      master.add(centerTL.play(0), 0);
      master.add(linesTL.play(0), 0.08);
      master.add(nodesTL.play(0), 0.12);

      const st = ScrollTrigger.create({
  trigger: stage,
  start: "top top",      // pin as soon as stage hits top of viewport
  end: "+=700",          // enough space to see the full deployment
  pin: true,
  pinSpacing: true,
  anticipatePin: 1,
  toggleActions: "play none none reverse",
  onEnter: () => {
    initStyles();
    updateLines();
    master.play(0);
  },
  onEnterBack: () => {
    initStyles();
    updateLines();
    master.play(0);
  },
  onUpdate: updateLines,
});


      const onResize = () => {
        updateLines();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", onResize);
      ScrollTrigger.addEventListener("refreshInit", updateLines);

      return () => {
        window.removeEventListener("resize", onResize);
        ScrollTrigger.removeEventListener("refreshInit", updateLines);
        st.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [nodes]);

  return (
    <section id="proof" ref={root} className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs tracking-[0.45em] text-white/60">PROOF</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
        Evidence, not noise.
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-white/70">
        Results come from standards executed over time. Here’s what that looks like.
      </p>

      <div
        ref={stageRef}
        className="orbit-stage relative mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03]"
      >
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-28 -bottom-28 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
        </div>

        <div className="relative h-[70vh] min-h-[520px] w-full">
          {/* SVG Tethers (pixel coords, no viewBox) */}
          <svg
            ref={svgRef}
            className="pointer-events-none absolute inset-0 z-10"
            width="100%"
            height="100%"
          >
            {nodes.map((n) => (
              <line
                key={n.id}
                ref={(el) => {
                    lineRefs.current[n.id] = el;
                    }}
                x1="0"
                y1="0"
                x2="0"
                y2="0"
                stroke="rgba(47,179,255,0.35)"
                strokeWidth="1"
              />
            ))}
          </svg>

          {/* Center */}
          <div
            ref={centerRef}
            className="orbit-center opacity-0 absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative h-[280px] w-[230px] overflow-hidden rounded-[2.2rem] border border-white/15 bg-black/30 shadow-[0_0_80px_rgba(255,255,255,0.08)] md:h-[360px] md:w-[290px]">
              <Image
                src="/proof-center.jpg"
                alt="Client transformation / training"
                fill
                className="object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.55))]" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] tracking-[0.35em] text-white/60">
                  COACHED OUTCOME
                </p>
                <p className="mt-1 text-sm font-semibold">
                  Consistency. Structure. Results.
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 md:h-[560px] md:w-[560px]" />
          </div>

          {/* Nodes */}
          {nodes.map((n) => (
            <div
              key={n.id}
              ref={(el) => {
                nodeRefs.current[n.id] = el;
                }}
              className="orbit-node opacity-0 absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="group relative w-[240px] rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm transition hover:border-white/30 hover:bg-white/[0.05]">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-2xl font-semibold tracking-tight">{n.k}</p>
                  <p className="text-[10px] tracking-[0.35em] text-white/55 uppercase">
                    {n.v}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{n.d}</p>
                <div className="mt-4 h-[2px] w-10 bg-[#2FB3FF]/70 opacity-70 transition group-hover:w-16 group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-40 flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4 text-xs text-white/55">
          <span className="tracking-[0.35em] uppercase">Application-only</span>
          <span className="tracking-[0.35em] uppercase">
            The standard does not change
          </span>
        </div>
      </div>
    </section>
  );
}
