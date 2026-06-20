import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Footprints,
  Leaf,
  Lightbulb,
  Target,
  Trophy,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { DemoButton } from "@/components/layout/demo-button";
const features = [
  [
    BarChart3,
    "See the whole picture",
    "Clear weekly trends and category breakdowns reveal where your footprint comes from.",
  ],
  [
    Lightbulb,
    "Insights that feel doable",
    "Personal recommendations turn your data into a practical next step.",
  ],
  [Target, "Build momentum", "Set reduction goals, complete actions, and see every kilogram you save."],
  [
    Trophy,
    "Celebrate consistency",
    "Streaks and badges make better habits visible without guilt or pressure.",
  ],
];
export default function Landing() {
  return (
    <main className="overflow-hidden bg-paper">
      <section className="relative min-h-[92vh] bg-ink text-white">
        <Image
          src="/ecopulse-hero.png"
          alt="Sustainable city with metro, cycling paths, solar roofs and urban gardens"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
          <Logo light />
          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-md px-4 py-2 text-sm font-bold hover:bg-white/10 sm:block"
              href="/login"
            >
              Log in
            </Link>
            <Link
              className="rounded-md bg-lime px-4 py-2 text-sm font-extrabold text-ink hover:bg-white"
              href="/register"
            >
              Get started
            </Link>
          </div>
        </nav>
        <div className="relative z-10 mx-auto flex min-h-[calc(92vh-88px)] max-w-7xl items-center px-5 pb-16">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-lime">
              <Leaf size={16} />
              Small choices. Visible impact.
            </p>
            <h1 className="font-display text-5xl font-medium leading-[.95] sm:text-7xl">
              Track your footprint.
              <br />
              <em className="text-lime">Build greener habits.</em>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/80 sm:text-lg">
              EcoPulse turns everyday travel, food, energy, shopping and waste into clear carbon insights you
              can act on.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-lime px-6 text-sm font-extrabold text-ink hover:bg-white"
              >
                Start tracking <ArrowRight size={17} />
              </Link>
              <DemoButton className="h-12 border-white/30 bg-white/10 text-white hover:bg-white/20" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 z-10 grid w-[min(94%,780px)] -translate-x-1/2 translate-y-1/2 grid-cols-3 rounded-lg bg-white p-4 text-ink shadow-soft sm:p-6">
          <div>
            <strong className="block text-xl sm:text-2xl">12.5 kg</strong>
            <span className="text-xs text-ink/55">saved this month</span>
          </div>
          <div className="border-x border-ink/10 px-4">
            <strong className="block text-xl sm:text-2xl">8 days</strong>
            <span className="text-xs text-ink/55">green streak</span>
          </div>
          <div className="pl-4">
            <strong className="block text-xl sm:text-2xl">14</strong>
            <span className="text-xs text-ink/55">actions done</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-32">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-extrabold uppercase text-coral">The blind spot</p>
            <h2 className="mt-3 font-display text-4xl leading-tight">
              You can’t improve what you can’t see.
            </h2>
          </div>
          <p className="self-end text-lg leading-8 text-ink/65">
            Most of us want to live more sustainably, but carbon numbers feel abstract. EcoPulse translates
            ordinary choices into one shared measure, then points to the changes that matter most.
          </p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([Icon, title, copy]) => (
            <article key={String(title)} className="border-t-2 border-ink pt-5">
              <Icon className="text-emerald" />
              <h3 className="mt-8 text-lg font-extrabold">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/60">{copy as string}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="grid-texture bg-white py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-sm font-extrabold uppercase text-emerald">How it works</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl">
            A lighter footprint, one clear step at a time.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 md:grid-cols-4">
            {[
              [Footprints, "01", "Log daily activity"],
              [BarChart3, "02", "Get your estimate"],
              [CheckCircle2, "03", "Complete eco actions"],
              [Trophy, "04", "Track improvement"],
            ].map(([I, n, t]) => (
              <div key={String(n)} className="bg-white p-6">
                <div className="flex items-center justify-between">
                  <I className="text-emerald" />
                  <span className="font-display text-3xl text-ink/20">{n as string}</span>
                </div>
                <h3 className="mt-10 font-extrabold">{t as string}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-lime py-20 text-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-end">
          <div>
            <p className="font-bold">Your next action starts here.</p>
            <h2 className="mt-3 max-w-2xl font-display text-5xl leading-none">
              Make your everyday impact count.
            </h2>
          </div>
          <Link
            href="/register"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-md bg-ink px-6 text-sm font-bold text-white"
          >
            Create your account <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <footer className="bg-ink py-8 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
          <Logo light />
          <span className="text-xs text-white/50">Built for a lower-carbon tomorrow.</span>
        </div>
      </footer>
    </main>
  );
}
