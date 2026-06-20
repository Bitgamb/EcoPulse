import type { Category } from "@/types/carbon";

export const activities = {
  transport: {
    car_km: ["Car travel", 0.192, "km"],
    bike_km: ["Bike / scooter", 0.103, "km"],
    bus_km: ["Bus travel", 0.089, "km"],
    train_km: ["Train", 0.041, "km"],
    metro_km: ["Metro", 0.035, "km"],
    auto_km: ["Auto rickshaw", 0.12, "km"],
    flight_km: ["Flight", 0.255, "km"],
  },
  electricity: {
    electricity_kwh: ["Electricity usage", 0.82, "kWh"],
    ac_hour: ["AC usage", 1.2, "hours"],
    fan_hour: ["Fan usage", 0.05, "hours"],
    refrigerator_day: ["Refrigerator usage", 1.5, "days"],
    washing_machine_cycle: ["Washing machine", 0.6, "cycles"],
  },
  food: {
    vegetarian_meal: ["Vegetarian meal", 1.5, "meals"],
    non_veg_meal: ["Non-vegetarian meal", 5, "meals"],
    chicken_meal: ["Chicken meal", 3.5, "meals"],
    mutton_meal: ["Mutton meal", 7.5, "meals"],
    dairy_meal: ["Dairy-heavy meal", 2.2, "meals"],
    packaged_food: ["Packaged food", 1.8, "items"],
  },
  shopping: {
    clothing_item: ["Clothing purchase", 8, "items"],
    online_delivery: ["Online delivery", 1.2, "orders"],
    electronics_item: ["Electronics purchase", 50, "items"],
    fast_fashion_item: ["Fast fashion item", 12, "items"],
  },
  waste: {
    plastic_bottle: ["Plastic bottle", 0.08, "bottles"],
    plastic_bag: ["Plastic bag", 0.03, "bags"],
    paper_waste_kg: ["Paper waste", 1.1, "kg"],
    food_waste_kg: ["Food waste", 2.5, "kg"],
    recycled_waste_kg: ["Recycled waste", -0.5, "kg"],
  },
} as const;
export type ActivityType = { [K in Category]: keyof (typeof activities)[K] }[Category];

const activityIndex = new Map(
  Object.values(activities)
    .flatMap((category) => Object.entries(category))
    .map(([key, metadata]) => [key, metadata] as const),
);

export function calculateCO2(activityType: string, value: number) {
  const item = activityIndex.get(activityType);
  return item ? Math.round(value * Number(item[1]) * 100) / 100 : 0;
}

export function getActivityMeta(type: string) {
  return activityIndex.get(type);
}
