import type { CategoryId } from "@/types/classification";
import type { CategoryModule } from "./auto";

import { AUTO_MODULE } from "./auto";
import { BEAUTY_MODULE } from "./beauty";
import { TECH_MODULE } from "./tech";
import { PET_MODULE } from "./pet";
import { WELLNESS_MODULE } from "./wellness";
import { HOME_MODULE } from "./home";
import { FASHION_MODULE } from "./fashion";
import { FITNESS_MODULE } from "./fitness";
import { KITCHEN_MODULE } from "./kitchen";
import { BABY_MODULE } from "./baby";
import { OUTDOOR_MODULE } from "./outdoor";
import { OFFICE_MODULE } from "./office";

const CATEGORY_MODULES: Record<CategoryId, CategoryModule> = {
  AUTO: AUTO_MODULE,
  BEAUTY: BEAUTY_MODULE,
  TECH: TECH_MODULE,
  PET: PET_MODULE,
  WELLNESS: WELLNESS_MODULE,
  HOME: HOME_MODULE,
  FASHION: FASHION_MODULE,
  FITNESS: FITNESS_MODULE,
  KITCHEN: KITCHEN_MODULE,
  BABY: BABY_MODULE,
  OUTDOOR: OUTDOOR_MODULE,
  OFFICE: OFFICE_MODULE,
};

export function getCategoryModule(categoryId: CategoryId): CategoryModule {
  return CATEGORY_MODULES[categoryId];
}

export type { CategoryModule };
