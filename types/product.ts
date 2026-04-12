export type ExtractedProduct = {
  url: string;
  title: string | null;
  description: string | null;
  price: number | null;
  currency: string | null;
  images: string[];
  category_tags: string[];
  ingredients_or_materials: string | null;
  claims: string[];
  review_signals: {
    rating: number | null;
    review_count: number | null;
    recurring_phrases: string[];
  };
  badges: string[];
  sold_count: string | null;
  raw_text: string;
};
