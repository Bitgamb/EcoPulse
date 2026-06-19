import type { CarbonEntry, Category } from "@/types/carbon";
const sum=(entries:CarbonEntry[])=>Math.round(entries.reduce((a,e)=>a+Number(e.co2_amount),0)*100)/100;
const since=(days:number)=>{const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-days+1); return d};
export const calculateWeeklyTotal=(e:CarbonEntry[])=>sum(e.filter(x=>new Date(x.entry_date)>=since(7)));
export const calculateMonthlyTotal=(e:CarbonEntry[])=>sum(e.filter(x=>new Date(x.entry_date)>=since(30)));
export const calculateCO2Saved=(e:CarbonEntry[],actionSavings=0)=>Math.max(0,Math.round((actionSavings+Math.abs(sum(e.filter(x=>x.co2_amount<0))))*100)/100);
export function getBiggestEmissionCategory(entries:CarbonEntry[]):Category|null { const totals=new Map<Category,number>(); entries.forEach(e=>totals.set(e.category,(totals.get(e.category)||0)+Math.max(0,e.co2_amount))); return [...totals].sort((a,b)=>b[1]-a[1])[0]?.[0]??null; }
export const calculateEcoScore=(monthly:number,completed=0,streak=0)=>Math.max(0,Math.min(100,Math.round(100-monthly*.45+completed*2+Math.min(streak,10))));
export const calculateGoalProgress=(current:number,target:number)=>target<=0?0:Math.min(100,Math.max(0,Math.round(current/target*100)));
