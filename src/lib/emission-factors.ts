import type { Category } from "@/types/carbon";

export const activities = {
  transport: { car_km:["Car travel",.192,"km"], bike_km:["Bike / scooter",.103,"km"], bus_km:["Bus travel",.089,"km"], train_km:["Train",.041,"km"], metro_km:["Metro",.035,"km"], auto_km:["Auto rickshaw",.12,"km"], flight_km:["Flight",.255,"km"] },
  electricity: { electricity_kwh:["Electricity usage",.82,"kWh"], ac_hour:["AC usage",1.2,"hours"], fan_hour:["Fan usage",.05,"hours"], refrigerator_day:["Refrigerator usage",1.5,"days"], washing_machine_cycle:["Washing machine",.6,"cycles"] },
  food: { vegetarian_meal:["Vegetarian meal",1.5,"meals"], non_veg_meal:["Non-vegetarian meal",5,"meals"], chicken_meal:["Chicken meal",3.5,"meals"], mutton_meal:["Mutton meal",7.5,"meals"], dairy_meal:["Dairy-heavy meal",2.2,"meals"], packaged_food:["Packaged food",1.8,"items"] },
  shopping: { clothing_item:["Clothing purchase",8,"items"], online_delivery:["Online delivery",1.2,"orders"], electronics_item:["Electronics purchase",50,"items"], fast_fashion_item:["Fast fashion item",12,"items"] },
  waste: { plastic_bottle:["Plastic bottle",.08,"bottles"], plastic_bag:["Plastic bag",.03,"bags"], paper_waste_kg:["Paper waste",1.1,"kg"], food_waste_kg:["Food waste",2.5,"kg"], recycled_waste_kg:["Recycled waste",-.5,"kg"] }
} as const;
export type ActivityType = { [K in Category]: keyof (typeof activities)[K] }[Category];
export function calculateCO2(activityType:string,value:number){
  const item = Object.values(activities).flatMap(v=>Object.entries(v)).find(([key])=>key===activityType)?.[1];
  return item ? Math.round(value * Number(item[1]) * 100) / 100 : 0;
}
export function getActivityMeta(type:string){ return Object.values(activities).flatMap(v=>Object.entries(v)).find(([key])=>key===type)?.[1]; }
