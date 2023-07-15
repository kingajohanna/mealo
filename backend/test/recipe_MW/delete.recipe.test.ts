import { NextFunction, Request, Response } from "express";
import { deleteRecipe } from "../../src/middlewares/recipe";
import { Recipe } from "../../src/models/Recipe";
import { User } from "../../src/models/User";
import { HTTPResponse } from "../../src/const/HttpRespone";

describe("deleteRecipe", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {
        recipeId: "recipe123",
      },
    } as unknown as Request;
    res = {
      locals: {
        uid: "user123",
      },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    } as unknown as Response;
    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should delete the recipe and return 'deleted'", async () => {
    const mockUser = {
      id: "user123",
      recipes: ["recipe123", "recipe456"],
      save: jest.fn(),
    };
    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
    jest.spyOn(Recipe, "findOneAndDelete").mockResolvedValue({});

    await deleteRecipe(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ id: "user123" });
    expect(mockUser.recipes).toEqual([]); // Verify that the recipe is removed from the user's recipes
    expect(mockUser.save).toHaveBeenCalled();
    expect(Recipe.findOneAndDelete).toHaveBeenCalledWith({
      id: "recipe123",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("deleted");
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if user is not found", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue(null);

    await deleteRecipe(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ id: "user123" });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(HTTPResponse[404]);
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors and return 500", async () => {
    jest.spyOn(User, "findOne").mockRejectedValue(new Error("Some error"));

    await deleteRecipe(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ id: "user123" });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
    expect(next).not.toHaveBeenCalled();
  });
});
