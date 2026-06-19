import { getBiggestEmissionCategory } from "./calculations";
import type { CarbonEntry, Category, Insight } from "@/types/carbon";
const rules:Record<Category,Omit<Insight,"description"|"category">>={
 transport:{title:"Transport is leading your footprint",action:"Swap one 10 km car trip for the metro this week.",saving:1.57,priority:"High",impact:9},
 electricity:{title:"Your home energy has room to breathe",action:"Set the AC to 24°C and shorten daily use by one hour.",saving:1.2,priority:"High",impact:8},
 food:{title:"A few meals can make a big difference",action:"Replace two meat meals with vegetarian meals.",saving:7,priority:"Medium",impact:8},
 shopping:{title:"Buy slower, bundle smarter",action:"Skip one fast-fashion item and combine deliveries.",saving:12,priority:"Medium",impact:7},
 waste:{title:"Turn daily waste into an easy win",action:"Carry a reusable bottle and separate recyclable waste.",saving:.9,priority:"Medium",impact:6}
};
export function generateInsights(entries:CarbonEntry[]):Insight[]{
 const totals=entries.reduce((a,e)=>(a[e.category]=(a[e.category]||0)+Math.max(0,e.co2_amount),a),{} as Partial<Record<Category,number>>);
 const biggest=getBiggestEmissionCategory(entries);
 return (Object.keys(rules) as Category[]).filter(c=>totals[c]||c===biggest).sort((a,b)=>(totals[b]||0)-(totals[a]||0)).map((category,i)=>({...rules[category],category,priority:i===0?"High":rules[category].priority,description:`You recorded ${(totals[category]||0).toFixed(1)} kg CO₂e from ${category}.`}));
}
