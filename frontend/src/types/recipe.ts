export type Meal = { meal: string; day: string; id: string };

export type Recipe = {
  title: string;
  totalTime: string | undefined;
  ingredients: string[];
  instructions: string[];
  image: string;
  author?: string;
  canonical_url?: string;
  category?: string;
  cookTime?: string;
  cuisine?: string;
  description?: string;
  host?: string;
  language?: string;
  nutrients?: string;
  prepTime?: string;
  ratings?: string;
  reviews?: string;
  siteName?: string;
  yields?: string;
  id: string;
  is_favorite?: boolean;
  speed?: string;
  calories?: string;
  difficulty?: string;
  folders?: string[];
  meals?: Meal[];
  video?: string;
  [key: string]: string | undefined | boolean | string[] | Meal[];
};
