"use client";import { useRouter } from "next/navigation";import { Button } from "@/components/ui/button";
export function DemoButton({className=""}:{className?:string}){const router=useRouter();return <Button variant="secondary" className={className} onClick={()=>{document.cookie="ecopulse-demo=true; path=/; max-age=86400; samesite=lax";router.push("/dashboard")}}>View demo</Button>}
