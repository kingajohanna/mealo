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
  id?: string;
  is_favorite?: boolean;
  speed?: string;
  [key: string]: string | undefined | boolean | string[];
};

export const testRecipe: Recipe = {
  title: 'test',
  totalTime: '120 min',
  ingredients: ['alma', 'körte', 'bab', '4 bab'],
  instructions: ['főzd meg', 'edd meg'],
  is_favorite: true,
  image:
    'https://images.everydayhealth.com/images/diet-nutrition/34da4c4e-82c3-47d7-953d-121945eada1e00-giveitup-unhealthyfood.jpg',
};
