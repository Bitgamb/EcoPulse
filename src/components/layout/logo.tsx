import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return <Link href="/" aria-label="EcoPulse home" className={`inline-flex items-center gap-2.5 text-lg font-extrabold ${light ? "text-white" : "text-ink"}`}>
    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white p-1 shadow-sm ring-1 ring-ink/10">
      <Image src="/ecopulse-logo.png" width={30} height={30} alt="" priority />
    </span>
    <span>EcoPulse</span>
  </Link>;
}
