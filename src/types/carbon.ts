export const categories = ["transport", "electricity", "food", "shopping", "waste"] as const;
export type Category = (typeof categories)[number];
export type CarbonEntry = { id:string; category:Category; activity_type:string; value:number; unit:string; co2_amount:number; entry_date:string; note?:string|null };
export type EcoAction = { id:string; title:string; description:string; category:Category; estimated_saving:number; difficulty:"Easy"|"Medium"|"Hard"; completed:boolean };
export type Goal = { id:string; title:string; category?:Category|null; target_reduction:number; current_progress:number; deadline:string; status:"active"|"completed"|"expired" };
export type Insight = { title:string; description:string; action:string; saving:number; priority:"High"|"Medium"|"Low"; impact:number; category:Category };
