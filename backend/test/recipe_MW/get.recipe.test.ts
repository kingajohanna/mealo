import { NextFunction, Request, Response } from "express";
import { getRecipe } from "../../src/middlewares/recipe";
import { Recipe } from "../../src/models/Recipe";
import { HTTPResponse } from "../../src/const/HttpRespone";

describe("getRecipe", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as unknown as Request;
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
      send: jest.fn(),
      locals: {
        uid: "user123",
      },
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should retrieve recipes and return them as JSON", async () => {
    const mockRecipes = [
      { id: "recipe1", name: "Recipe 1" },
      { id: "recipe2", name: "Recipe 2" },
    ];

    const findMock = jest.spyOn(Recipe, "find").mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockRecipes),
    } as any);

    await getRecipe(req, res, next);

    expect(findMock).toHaveBeenCalledWith({ uid: "user123" });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRecipes);
    expect(res.send).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should send a 500 response if an error occurs during recipe retrieval", async () => {
    jest.spyOn(Recipe, "find").mockImplementation(() => {
      throw new Error("Mock find error");
    });

    await getRecipe(req, res, next);

    expect(Recipe.find).toHaveBeenCalledWith({ uid: "user123" });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
    expect(res.json).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
