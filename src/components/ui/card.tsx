import { cn } from "@/lib/utils";
export function Card({className,...p}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn("rounded-lg border border-ink/10 bg-white p-5 shadow-sm",className)} {...p}/>}
