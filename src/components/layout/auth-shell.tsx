import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Logo } from "./logo";
import { DemoButton } from "./demo-button";
export function AuthShell({
  title,
  copy,
  children,
}: {
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-[.88fr_1.12fr]">
      <section className="relative flex flex-col bg-white p-6 sm:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-lime" />
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="flex items-center gap-1 text-sm font-bold text-ink/55 hover:text-ink">
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
        <div className="mx-auto my-auto w-full max-w-md py-12">
          <span className="mb-4 inline-flex rounded-md bg-emerald/10 px-2.5 py-1 text-[11px] font-extrabold uppercase text-emerald">
            Your personal carbon dashboard
          </span>
          <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
          <p className="mb-8 mt-3 leading-6 text-ink/55">{copy}</p>
          {children}
          <div className="my-6 flex items-center gap-3 text-xs text-ink/35">
            <span className="h-px flex-1 bg-ink/10" />
            or explore first
            <span className="h-px flex-1 bg-ink/10" />
          </div>
          <DemoButton className="w-full" />
        </div>
        <p className="text-center text-[11px] text-ink/35">
          Your activity data stays private to your account.
        </p>
      </section>
      <aside className="relative hidden min-h-screen overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-end">
        <Image
          src="/ecopulse-hero.png"
          alt="Green city with clean transport and urban gardens"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
        <div className="relative p-12 xl:p-16">
          <span className="inline-flex rounded-md bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase text-ink">
            Built for real life
          </span>
          <p className="mt-5 max-w-xl font-display text-4xl leading-tight xl:text-5xl">
            Know what matters. Change what’s practical. See the difference.
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {["Private by design", "Actionable insights", "Progress you can see"].map((x) => (
              <div key={x} className="border-t border-lime/70 pt-3 text-xs font-bold">
                <CheckCircle2 className="mb-2 text-lime" size={18} />
                {x}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
