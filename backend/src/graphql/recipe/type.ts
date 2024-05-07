export const recipeType = `
    scalar Upload

    input MealInput {
      meal: String
      day: String
    }

    input RecipeInput {
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
        instructions: [String]
        ratings: String
        author: String
        cuisine: String
        description: String
        reviews: [String]
        siteName: String
        is_favorite: Boolean
        calories: String
        difficulty: String
        folders: [String]
        meals: [MealInput]
        video: String
    }

    type Meal {
      meal: String
      day: String
      id: String
    }

    type Recipe {
        _id: String
        id: Int
        uid: String
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
        nutrients: String
        language: String
        ingredients: [String]
        instructions: [String]
        ratings: String
        author: String
        cuisine: String
        description: String
        reviews: [String]
        siteName: String
        is_favorite: Boolean
        calories: String
        difficulty: String
        folders: [String]
        meals: [Meal]
        video: String
    }

    type Recipes {
      recipes: [Recipe]
      categories: [String]
      cuisines: [String]
      folders: [String]
    }

    type Predict {
      key: Int
      recipes: [Recipe]
    }

    type RecipeListResponse {
      cuisine: [Predict]
      dish: [Predict]
    }

    type SearchResultsResponse {
      text: [Recipe]
      tags: [Recipe]
    }

    type Query {
        getRecipes: Recipes
        getRecipe(recipeId: Int!): Recipe
        getSuggestions: RecipeListResponse
        getSearchResults(title: String, dish: [Int], cuisine: [Int], category: [Int]): SearchResultsResponse
    }

    type Mutation {
        addRecipe( url: String!): Recipe
        saveRecipe( recipe: RecipeInput! ): Recipe
        addOcrRecipe( recipe: RecipeInput, image: Upload ): Recipe
        editRecipe( recipeId: Int!, body: RecipeInput! ): Recipe
        deleteRecipe( recipeId: Int! ): Recipe
        favoriteRecipe( recipeId: Int! ): Recipe
        folderRecipe( recipeId: Int!, folders: [String] ): Recipe
        addMeal( recipeId: Int!, meal: MealInput ): Recipe
        removeMeal( recipeId: Int!, mealId: String ): Recipe
        analyzeRecipe( recipeId: Int! ): Recipe
        bingAnalyzer(text: String!): String
    }
`;
