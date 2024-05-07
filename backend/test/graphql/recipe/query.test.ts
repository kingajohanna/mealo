import { recipeQuery } from "../../../src/graphql/recipe";
import { ContextType } from "../../../src/graphql/types";
import { Recipe } from "../../../src/models/Recipe";
import { RecipeList } from "../../../src/models/RecipeList";
import { User } from "../../../src/models/User";
import { contextMock, recipeMock } from "../mocks/mocks";
import { predictMock } from "../mocks/mocks";

describe("Recipe Queries", () => {
  let context: ContextType;

  beforeAll(async () => {
    context = contextMock;
    await new RecipeList({
      ...recipeMock,
      id: 1,
      predict: {
        category: 0,
        cuisine: 0,
        dish: 0,
      },
    }).save();
    await new RecipeList({ ...recipeMock, id: 2 }).save();
    await new RecipeList({
      ...recipeMock,
      id: 3,
      predict: {
        category: 1,
        cuisine: 1,
        dish: 1,
      },
    }).save();
    await new User({
      id: context.uid,
      email: context.email,
      ...predictMock,
    }).save();

    await new Recipe({ ...recipeMock }).save();
  });

  test("getRecipes query", async () => {
    const args = {};

    const result = await recipeQuery.getRecipes(null, args, context);

    expect(result).toHaveProperty("recipes");
    expect(result).toHaveProperty("categories");
    expect(result).toHaveProperty("cuisines");
    expect(result).toHaveProperty("folders");
  });

  test("getRecipe query", async () => {
    const args = { recipeId: 1 };

    const result = await recipeQuery.getRecipe(null, args, context);

    expect(result).toBeDefined();
  });

  test("getSuggestions query", async () => {
    const args = {};

    const result = await recipeQuery.getSuggestions(null, args, context);

    expect(result).toHaveProperty("cuisine");
    expect(result).toHaveProperty("dish");
  });

  test("getSearchResults", async () => {
    const args = {
      category: [0],
      dish: [0],
      cuisine: [0],
      title: "",
    };

    const expectedResult = {
      tags: [
        {
          author: "Mock Author",
          calories: "200",
          canonical_url: "http://mock-url.com",
          category: "Mock Category",
          cookTime: "20 minutes",
          cuisine: "Mock Cuisine",
          description: "Mock Description",
          difficulty: "Easy",
          dish: null,
          folders: ["Folder 1", "Folder 2"],
          host: "Mock Host",
          id: "1",
          image: "mock-image.jpg",
          ingredients: ["Ingredient 1", "Ingredient 2"],
          instructions: ["Step 1", "Step 2"],
          language: "English",
          nutrients: ["Mock Nutrients"],
          predict: {
            category: 0,
            cuisine: 0,
            dish: 0,
          },
          prepTime: "10 minutes",
          ratings: "4.5",
          reviews: ["10"],
          siteName: "Mock Site",
          speed: "Medium",
          title: "Mock Recipe",
          totalTime: "30 minutes",
          video: "http://mock-video.com",
          yields: "4 servings",
        },
      ],
      text: [],
    };
    const result = await recipeQuery.getSearchResults(null, args, context);

    expect(result.tags[0].author).toEqual(expectedResult.tags[0].author);
  });
});
