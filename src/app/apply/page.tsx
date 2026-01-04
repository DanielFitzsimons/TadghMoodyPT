"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

type Goal = "build" | "fatloss" | "hybrid" | "performance";
type Experience = "beginner" | "intermediate" | "advanced";
type Obstacle = "consistency" | "nutrition" | "structure" | "mindset";
type Days = "3" | "4" | "5";

type FormState = {
  name: string;
  email: string;
  bodyWeightKg: string; // store as string for input
  goal: Goal | "";
  experience: Experience | "";
  daysPerWeek: Days | "";
  obstacle: Obstacle | "";
  injuries: string;
  whyNow: string;
};

const initial: FormState = {
  name: "",
  email: "",
  bodyWeightKg: "",
  goal: "",
  experience: "",
  daysPerWeek: "",
  obstacle: "",
  injuries: "",
  whyNow: "",
};

type StepId =
  | "intro"
  | "identity"
  | "bodyweight"
  | "goal"
  | "experience"
  | "days"
  | "obstacle"
  | "injuries"
  | "whyNow"
  | "review";

type Step = {
  id: StepId;
  title: string;
  hint?: string;
};

export default function ApplyPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const stageRef = useRef<HTMLDivElement | null>(null);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "intro",
        title: "This isn’t a purchase. It’s an application.",
        hint: "Answer honestly. Your answers shape your coaching approach.",
      },
      { id: "identity", title: "Who are you?", hint: "Name + email." },
      { id: "bodyweight", title: "Current body weight", hint: "kg (estimate is fine)." },
      { id: "goal", title: "Aspirations", hint: "What’s your primary goal?" },
      { id: "experience", title: "Training experience", hint: "Be accurate." },
      { id: "days", title: "Commitment", hint: "How many days per week can you train?" },
      { id: "obstacle", title: "Biggest obstacle", hint: "What’s been holding you back?" },
      { id: "injuries", title: "Injuries / limitations", hint: "Optional, but helpful." },
      { id: "whyNow", title: "Why now?", hint: "Be honest — short is fine." },
      { id: "review", title: "Review & submit", hint: "Check everything before sending." },
    ],
    []
  );

  const currentStep = steps[stepIndex];

  // ----------------------
  // Animations
  // ----------------------
  const animateIn = () => {
    if (!stageRef.current) return;
    gsap.fromTo(
      stageRef.current,
      { opacity: 0, y: 10, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }
    );
  };

  const animateOut = async () => {
    if (!stageRef.current) return;
    await gsap.to(stageRef.current, {
      opacity: 0,
      y: -8,
      filter: "blur(6px)",
      duration: 0.32,
      ease: "power2.in",
    });
  };

  useLayoutEffect(() => {
    animateIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // ----------------------
  // Helpers
  // ----------------------
  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const canGoNext = () => {
    const id = currentStep.id;
    if (id === "intro") return true;
    if (id === "identity") return form.name.trim() && form.email.trim();
    if (id === "bodyweight") return !!form.bodyWeightKg.trim();
    if (id === "goal") return !!form.goal;
    if (id === "experience") return !!form.experience;
    if (id === "days") return !!form.daysPerWeek;
    if (id === "obstacle") return !!form.obstacle;
    // injuries optional
    if (id === "injuries") return true;
    if (id === "whyNow") return form.whyNow.trim().length >= 0; // allow blank if you want
    if (id === "review") return true;
    return true;
  };

  const next = async () => {
    if (status === "submitting") return;
    if (!canGoNext()) return;

    await animateOut();
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const back = async () => {
    if (status === "submitting") return;
    if (stepIndex === 0) return;
    await animateOut();
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const jumpTo = async (index: number) => {
    if (status === "submitting") return;
    await animateOut();
    setStepIndex(index);
  };

  const submit = async () => {
    setStatus("submitting");
    setError("");

    try {
      const payload = {
        ...form,
        bodyWeightKg: Number(form.bodyWeightKg),
      };

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");

      setStatus("success");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Submission failed");
    } finally {
      setStatus("idle");
    }
  };

  // auto-advance for selection steps
  const selectAndNext = async <K extends keyof FormState>(k: K, v: FormState[K]) => {
    update(k, v);
    // tiny delay so selection feels registered before transition
    await new Promise((r) => setTimeout(r, 120));
    await next();
  };

  // ----------------------
  // UI
  // ----------------------
  const progressPct = Math.round((stepIndex / (steps.length - 1)) * 100);

  return (
    <main className="min-h-screen grain px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xs tracking-[0.35em] text-white/60 hover:text-white">
            ← BACK
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.35em] text-white/45 uppercase">
              {progressPct}%
            </span>
            <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-white/70"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-xs tracking-[0.45em] text-white/60 uppercase">
            APPLICATION • STEP {stepIndex + 1} / {steps.length}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {currentStep.title}
          </h1>
          {currentStep.hint && (
            <p className="mt-3 text-sm text-white/70">{currentStep.hint}</p>
          )}
        </div>

        {/* Stage */}
        <div
          ref={stageRef}
          className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-7 md:p-8"
        >
          {status === "success" ? (
            <SuccessCard />
          ) : (
            <StepRenderer
              stepId={currentStep.id}
              form={form}
              update={update}
              selectAndNext={selectAndNext}
              jumpTo={jumpTo}
            />
          )}

          {status === "error" && (
            <p className="mt-5 text-sm text-white/70">
              <span className="font-semibold text-white">Error:</span> {error}
            </p>
          )}
        </div>

        {/* Controls */}
        {status !== "success" && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={back}
              disabled={stepIndex === 0 || status === "submitting"}
              className="rounded-full border border-white/15 px-6 py-2 text-sm text-white/70 hover:border-white/30 hover:text-white disabled:opacity-40"
            >
              Back
            </button>

            {currentStep.id === "review" ? (
              <button
                type="button"
                onClick={submit}
                disabled={status === "submitting"}
                className="rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting..." : "Submit Application"}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                disabled={!canGoNext() || status === "submitting"}
                className="rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
              >
                Continue
              </button>
            )}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-white/45">
          Not everyone is accepted. Your answers are reviewed personally.
        </p>
      </div>
    </main>
  );
}

function SuccessCard() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Application received.</h2>
      <p className="mt-3 text-sm text-white/70">
        Your answers will be reviewed personally. If accepted, you’ll be contacted with next steps.
      </p>
      <p className="mt-6 text-xs tracking-[0.35em] text-white/45 uppercase">
        The plan adapts. The standard does not.
      </p>
    </div>
  );
}

function StepRenderer({
  stepId,
  form,
  update,
  selectAndNext,
  jumpTo,
}: {
  stepId: StepId;
  form: any;
  update: (k: any, v: any) => void;
  selectAndNext: (k: any, v: any) => Promise<void>;
  jumpTo: (index: number) => Promise<void>;
}) {
  switch (stepId) {
    case "intro":
      return (
        <div className="space-y-4">
          <p className="text-sm text-white/70">
            This application is designed to qualify people who are ready for structure and accountability.
          </p>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/60" />
              No templates. Your approach is built around you.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/60" />
              Standards are non-negotiable.
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-white/60" />
              Honest answers get the best outcome.
            </li>
          </ul>
          <p className="text-xs tracking-[0.35em] text-white/45 uppercase">
            Continue when ready.
          </p>
        </div>
      );

    case "identity":
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
              placeholder="Your name"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
              placeholder="you@email.com"
            />
          </Field>
        </div>
      );

    case "bodyweight":
      return (
        <div className="space-y-3">
          <Field label="Body weight (kg)">
            <input
              inputMode="decimal"
              value={form.bodyWeightKg}
              onChange={(e) => update("bodyWeightKg", e.target.value.replace(/[^\d.]/g, ""))}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
              placeholder="e.g., 82.5"
            />
          </Field>
          <p className="text-xs text-white/45">Estimate is fine — precision comes later.</p>
        </div>
      );

    case "goal":
      return (
        <ChoiceGrid
          options={[
            { key: "build", label: "Build muscle", sub: "Hypertrophy, strength, structure." },
            { key: "fatloss", label: "Fat loss", sub: "Done properly, sustainably." },
            { key: "hybrid", label: "Hybrid athlete", sub: "Strength + conditioning." },
            { key: "performance", label: "Performance", sub: "Train for events and outcomes." },
          ]}
          onPick={(v) => selectAndNext("goal", v)}
        />
      );

    case "experience":
      return (
        <ChoiceGrid
          options={[
            { key: "beginner", label: "Beginner", sub: "New or inconsistent training history." },
            { key: "intermediate", label: "Intermediate", sub: "Training regularly with some structure." },
            { key: "advanced", label: "Advanced", sub: "Years trained — want sharper progression." },
          ]}
          onPick={(v) => selectAndNext("experience", v)}
        />
      );

    case "days":
      return (
        <ChoiceGrid
          options={[
            { key: "3", label: "3 days/week", sub: "Minimum effective standard." },
            { key: "4", label: "4 days/week", sub: "Strong baseline for progress." },
            { key: "5", label: "5 days/week", sub: "High output. Requires recovery." },
          ]}
          onPick={(v) => selectAndNext("daysPerWeek", v)}
        />
      );

    case "obstacle":
      return (
        <ChoiceGrid
          options={[
            { key: "consistency", label: "Consistency", sub: "Start strong, fade out." },
            { key: "nutrition", label: "Nutrition", sub: "Can’t stick to intake long-term." },
            { key: "structure", label: "Structure", sub: "No clear plan, no progression." },
            { key: "mindset", label: "Mindset", sub: "Self-sabotage, excuses, confidence." },
          ]}
          onPick={(v) => selectAndNext("obstacle", v)}
        />
      );

    case "injuries":
      return (
        <div className="space-y-4">
          <Field label="Injuries / limitations (optional)">
            <input
              value={form.injuries}
              onChange={(e) => update("injuries", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
              placeholder="e.g., shoulder history, knee pain, none"
            />
          </Field>
          <p className="text-xs text-white/45">
            If you have a history, it changes how we build your plan.
          </p>
        </div>
      );

    case "whyNow":
      return (
        <div className="space-y-4">
          <Field label="Why now?">
            <textarea
              value={form.whyNow}
              onChange={(e) => update("whyNow", e.target.value)}
              className="min-h-[130px] w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/30"
              placeholder="What changed? What are you willing to do differently?"
            />
          </Field>
          <p className="text-xs text-white/45">Short is fine. Honest is better.</p>
        </div>
      );

    case "review":
      return (
        <div className="space-y-5">
          <p className="text-sm text-white/70">
            Review your answers. If something is wrong, go back and fix it.
          </p>

          <div className="grid gap-3">
            <ReviewRow label="Name" value={form.name} />
            <ReviewRow label="Email" value={form.email} />
            <ReviewRow label="Body weight (kg)" value={form.bodyWeightKg} />
            <ReviewRow label="Goal" value={form.goal} />
            <ReviewRow label="Experience" value={form.experience} />
            <ReviewRow label="Days/week" value={form.daysPerWeek} />
            <ReviewRow label="Obstacle" value={form.obstacle} />
            <ReviewRow label="Injuries" value={form.injuries || "—"} />
            <ReviewRow label="Why now" value={form.whyNow || "—"} />
          </div>

          <p className="text-xs tracking-[0.35em] text-white/45 uppercase">
            Submit when ready.
          </p>

          <div className="pt-2 text-xs text-white/45">
            Need to change something? Use <span className="text-white/70">Back</span>.
          </div>
        </div>
      );

    default:
      return null;
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-[0.35em] text-white/60 uppercase">{label}</span>
      {children}
    </label>
  );
}

function ChoiceGrid({
  options,
  onPick,
}: {
  options: { key: string; label: string; sub: string }[];
  onPick: (v: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onPick(o.key)}
          className="group rounded-3xl border border-white/10 bg-black/30 p-5 text-left transition hover:border-white/30 hover:bg-white/[0.05]"
        >
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold">{o.label}</p>
            <span className="text-xs text-white/40 group-hover:text-white/70">Select →</span>
          </div>
          <p className="mt-2 text-sm text-white/65">{o.sub}</p>
        </button>
      ))}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center md:justify-between">
      <p className="text-xs tracking-[0.35em] text-white/50 uppercase">{label}</p>
      <p className="text-sm text-white/80">{value}</p>
    </div>
  );
}
