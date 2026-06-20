import type { CarbonEntry, EcoAction } from "@/types/carbon";
export const badgeDefinitions = [
  { name: "Green Starter", description: "Log your first carbon entry", icon: "Sprout" },
  { name: "Low Carbon Commuter", description: "Complete 3 transport actions", icon: "TrainFront" },
  { name: "Energy Saver", description: "Complete 3 electricity actions", icon: "Zap" },
  { name: "Plastic-Free Starter", description: "Complete 3 waste actions", icon: "Recycle" },
  { name: "Green Week Champion", description: "Maintain a 7-day streak", icon: "Flame" },
  { name: "Climate Hero", description: "Save 25 kg CO2‚e", icon: "Award" },
];
export function getUnlockedBadges(
  entries: CarbonEntry[],
  actions: EcoAction[],
  streak: number,
  saved: number,
) {
  const done = (c: string) => actions.filter((a) => a.completed && a.category === c).length;
  return badgeDefinitions.filter((b) =>
    b.name === "Green Starter"
      ? entries.length > 0
      : b.name === "Low Carbon Commuter"
        ? done("transport") >= 3
        : b.name === "Energy Saver"
          ? done("electricity") >= 3
          : b.name === "Plastic-Free Starter"
            ? done("waste") >= 3
            : b.name === "Green Week Champion"
              ? streak >= 7
              : saved >= 25,
  );
}
