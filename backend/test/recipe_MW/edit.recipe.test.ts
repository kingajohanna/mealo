import { NextFunction, Request, Response } from "express";
import { editRecipe } from "../../src/middlewares/recipe";
import { Recipe } from "../../src/models/Recipe";
import { HTTPResponse } from "../../src/const/HttpRespone";

describe("editRecipe", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {
        recipeId: "123456789",
      },
      body: {
        name: "Updated Recipe",
      },
    } as unknown as Request;
    res = {
      json: jest.fn(),
      status: jest.fn(() => res),
      send: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should update a recipe and return the updated recipe", async () => {
    const recipeId = "123456789";
    const updatedRecipe = {
      id: recipeId,
      name: "Updated Recipe",
    };

    const findOneAndUpdateMock = jest
      .spyOn(Recipe, "findOneAndUpdate")
      .mockResolvedValue(updatedRecipe);

    await editRecipe(req, res, next);

    expect(findOneAndUpdateMock).toHaveBeenCalledWith(
      { id: recipeId },
      req.body,
      { new: true }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedRecipe);
    expect(res.send).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should send a 500 response if an error occurs during recipe update", async () => {
    jest
      .spyOn(Recipe, "findOneAndUpdate")
      .mockRejectedValue(new Error("Mock error"));

    await editRecipe(req, res, next);

    expect(Recipe.findOneAndUpdate).toHaveBeenCalledWith(
      { id: req.params.recipeId },
      req.body,
      { new: true }
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
    expect(res.json).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
