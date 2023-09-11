// The GraphQL schema
export const recipeType = `
    type Recipe {
        id: Int
        uid: Int
        host: String
        canonical_url: String
        title: String
        category: String
        speed: String
        totalTime: String
        cookTime: String
        prepTime: String
        yields: String
        image: String
        nutrients: [String]
        language: String
        ingredients: [String]
        instuctions: [String]
        ratings: String
        author: String
        cuisine: String
        description: String
        reviews: [String]
        siteName: String
        is_favorite: Boolean
    }

    type Query {
        getRecipes: [User]
    }
`;

const mockRecipe = {
  id: 1,
  uid: 123,
  host: "example.com",
  canonical_url: "https://example.com/recipes/123",
  title: "Delicious Recipe",
  category: "Main Dish",
  speed: "Medium",
  totalTime: "1 hour",
  cookTime: "45 minutes",
  prepTime: "15 minutes",
  yields: "4 servings",
  image: "https://example.com/images/recipe.jpg",
  nutrients: ["Protein", "Vitamin C"],
  language: "English",
  ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
  instructions: ["Step 1: Do this.", "Step 2: Do that.", "Step 3: Finish it."],
  ratings: "4.5",
  author: "John Doe",
  cuisine: "Italian",
  description: "A tasty recipe description.",
  reviews: ["Review 1", "Review 2", "Review 3"],
  siteName: "Example Recipes",
  is_favorite: false,
};

// A map of functions which return data for the schema.
export const recipeResolvers = {
  getRecipes() {
    return [mockRecipe];
  },
};
