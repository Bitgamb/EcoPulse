import type { CarbonEntry, EcoAction } from "@/types/carbon";

type BadgeContext = { entries: CarbonEntry[]; actions: EcoAction[]; streak: number; saved: number };

const completedIn = (actions: EcoAction[], category: EcoAction["category"]) =>
  actions.filter((action) => action.completed && action.category === category).length;

export const badgeDefinitions = [
  {
    name: "Green Starter",
    description: "Log your first carbon entry",
    icon: "Sprout",
    unlocked: ({ entries }: BadgeContext) => entries.length > 0,
  },
  {
    name: "Low Carbon Commuter",
    description: "Complete 3 transport actions",
    icon: "TrainFront",
    unlocked: ({ actions }: BadgeContext) => completedIn(actions, "transport") >= 3,
  },
  {
    name: "Energy Saver",
    description: "Complete 3 electricity actions",
    icon: "Zap",
    unlocked: ({ actions }: BadgeContext) => completedIn(actions, "electricity") >= 3,
  },
  {
    name: "Plastic-Free Starter",
    description: "Complete 3 waste actions",
    icon: "Recycle",
    unlocked: ({ actions }: BadgeContext) => completedIn(actions, "waste") >= 3,
  },
  {
    name: "Green Week Champion",
    description: "Maintain a 7-day streak",
    icon: "Flame",
    unlocked: ({ streak }: BadgeContext) => streak >= 7,
  },
  {
    name: "Climate Hero",
    description: "Save 25 kg CO2e",
    icon: "Award",
    unlocked: ({ saved }: BadgeContext) => saved >= 25,
  },
];

export function getUnlockedBadges(
  entries: CarbonEntry[],
  actions: EcoAction[],
  streak: number,
  saved: number,
) {
  const context = { entries, actions, streak, saved };
  return badgeDefinitions.filter((badge) => badge.unlocked(context));
}
