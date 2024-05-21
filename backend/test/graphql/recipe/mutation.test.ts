import { recipeMutation } from "../../../src/graphql/recipe";
import { ContextType } from "../../../src/graphql/types";
import { contextMock, predictMock, recipeMock } from "../mocks/mocks";
import { Recipe } from "../../../src/models/Recipe";
import { User } from "../../../src/models/User";
import axios from "axios";
import * as filesave from "../../../src/utils/filesave";

jest.mock("axios");
jest.mock("../../../src/utils/filesave");

describe("Recipe Mutations", () => {
  let context: ContextType;

  beforeAll(async () => {
    context = contextMock;
    await new User({
      id: context.uid,
      email: context.email,
      ...predictMock,
    }).save();
    await new Recipe({ ...recipeMock }).save();
  });

  test("addRecipe youtube mutation", async () => {
    const args = { url: "https://www.youtube.com/watch?v=example" };

    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        items: [
          {
            snippet: {
              title: "Recipe Title",
              thumbnails: { high: { url: "thumbnail-url" } },
              channelTitle: "Channel Title",
              description: "Recipe Description",
            },
          },
        ],
      },
    });

    const result = await recipeMutation.addRecipe(null, args, context);

    expect(result).toHaveProperty("title", "Recipe Title");
    expect(result).toHaveProperty("image", "thumbnail-url");
    expect(result).toHaveProperty(
      "video",
      "https://www.youtube.com/watch?v=example"
    );
  });

  test("addRecipe parse mutation", async () => {
    const args = { url: "http://mock-url.com" };

    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        ...recipeMock,
      },
    });

    const result = await recipeMutation.addRecipe(null, args, context);

    expect(result).toHaveProperty("title", "Mock Recipe");
    expect(result).toHaveProperty("image", "mock-image.jpg");
  });

  test("addRecipe already existing mutation", async () => {
    const args = { url: "http://mock-url.com" };

    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        ...recipeMock,
      },
    });

    const result = await recipeMutation.addRecipe(null, args, context);

    expect(result).toHaveProperty("title", "Mock Recipe");
    expect(result).toHaveProperty("image", "mock-image.jpg");
  });

  test("saveRecipe mutation", async () => {
    const args = {
      recipe: {
        title: "Saved Recipe",
        canonical_url: "https://saved-recipe.com",
      },
    };

    const result = await recipeMutation.saveRecipe(null, args, context);

    expect(result).toHaveProperty("title", "Saved Recipe");
    expect(result).toHaveProperty("canonical_url", "https://saved-recipe.com");
  });

  test("addOcrRecipe mutation", async () => {
    const args = {
      recipe: {
        title: "OCR Recipe",
      },
      image: "mocked-image",
    };

    const storeFileMock = jest.spyOn(filesave, "storeFile");
    storeFileMock.mockResolvedValue({ dbPath: "mocked-db-path" });

    const result = await recipeMutation.addOcrRecipe(null, args, context);

    expect(result).toHaveProperty("title", "OCR Recipe");
    expect(result).toHaveProperty("image", "mocked-db-path");
  });

  test("editRecipe mutation", async () => {
    const args = { recipeId: 1, body: { title: "Updated Recipe" } };

    const result = await recipeMutation.editRecipe(null, args);

    expect(result).toHaveProperty("title", "Updated Recipe");
  });

  test("favoriteRecipe mutation", async () => {
    const args = { recipeId: 1 };

    const result = await recipeMutation.favoriteRecipe(null, args, context);

    expect(result).toHaveProperty("is_favorite", true);
  });

  test("folderRecipe mutation", async () => {
    const args = { recipeId: 1, folders: ["Dinner"] };

    const result = await recipeMutation.folderRecipe(null, args, context);

    expect(result?.folders).toContain("Dinner");
  });

  test("addMeal mutation", async () => {
    const args = {
      recipeId: 1,
      meal: { meal: "Breakfast", day: "Monday", id: "meal-id-1" },
    };

    const result = await recipeMutation.addMeal(null, args, context);

    expect(result?.folders).toContain("Dinner");
  });

  test("removeMeal mutation", async () => {
    const args = { recipeId: 1, mealId: "meal-id-1" };

    const result = await recipeMutation.removeMeal(null, args, context);

    expect(result?.folders).toContain("Dinner");
  });

  test("analyzeRecipe mutation", async () => {
    const args = { recipeId: 1 };

    const responseMock = {
      data: {
        category: 1,
        cuisine: 2,
        dish: 3,
      },
    };

    (axios.post as jest.Mock).mockResolvedValue({
      ...responseMock,
    });

    const result = await recipeMutation.analyzeRecipe(null, args, context);

    expect(result?.category).toBe("Beverages");
  });

  test("deleteRecipe mutation", async () => {
    const args = { uid: "user-id", recipeId: 1 };

    const result = await recipeMutation.deleteRecipe(null, args, context);

    expect(result).toHaveProperty("id", "1");
  });

  test("bingAnalyzer mutation", async () => {
    const inputText = "Hello, this is a test message.";
    const expectedMessage = "Analysis complete.";

    (axios.post as jest.Mock).mockResolvedValue({
      data: { message: expectedMessage },
    });

    const result = await recipeMutation.bingAnalyzer(
      null,
      { text: inputText },
      context
    );

    expect(result).toBe(expectedMessage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
