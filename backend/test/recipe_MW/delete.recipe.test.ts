import { NextFunction, Request, Response } from "express";
import { deleteRecipe } from "../../src/middlewares/recipe";
import { Recipe } from "../../src/models/Recipe";
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
      status: jest.fn(() => res),
      send: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should delete the recipe and send a 200 response", async () => {
    const findOneAndDeleteMock = jest
      .spyOn(Recipe, "findOneAndDelete")
      .mockResolvedValueOnce({});

    await deleteRecipe(req, res, next);

    expect(findOneAndDeleteMock).toHaveBeenCalledWith({ id: "recipe123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("deleted");
    expect(next).not.toHaveBeenCalled();
  });

  it("should send a 500 response if an error occurs during recipe deletion", async () => {
    jest
      .spyOn(Recipe, "findOneAndDelete")
      .mockRejectedValueOnce(new Error("Mock error"));

    await deleteRecipe(req, res, next);

    expect(Recipe.findOneAndDelete).toHaveBeenCalledWith({ id: "recipe123" });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
    expect(next).not.toHaveBeenCalled();
  });
});
