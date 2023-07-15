import { NextFunction, Request, Response } from "express";
import { favoriteRecipe } from "../../src/middlewares/recipe";
import { Recipe } from "../../src/models/Recipe";
import { User } from "../../src/models/User";
import { HTTPResponse } from "../../src/const/HttpRespone";

describe("favoriteRecipe", () => {
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
      locals: {
        uid: "user123",
      },
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should favorite the recipe and send a 200 response", async () => {
    const userMock = {
      favorites: [],
      save: jest.fn(),
    };
    const recipeMock = {
      id: "recipe123",
      is_favorite: false,
    };
    jest.spyOn(User, "findOne").mockResolvedValueOnce(userMock);
    jest.spyOn(Recipe, "findOne").mockResolvedValueOnce(recipeMock);
    jest.spyOn(Recipe, "findOneAndUpdate").mockResolvedValueOnce(recipeMock);

    await favoriteRecipe(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ id: "user123" });
    expect(Recipe.findOne).toHaveBeenCalledWith({ id: "recipe123" });

    expect(Recipe.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "recipe123" },
      { is_favorite: true }
    );
    expect(userMock.favorites).toEqual(["recipe123"]);
    expect(userMock.save).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[200]);
    expect(next).not.toHaveBeenCalled();
  });

  it("should unfavorite the recipe and send a 200 response", async () => {
    const userMock = {
      favorites: [],
      save: jest.fn(),
    };
    const recipeMock = {
      id: "recipe123",
      is_favorite: true,
    };
    jest.spyOn(User, "findOne").mockResolvedValueOnce(userMock);
    jest.spyOn(Recipe, "findOne").mockResolvedValueOnce(recipeMock);
    jest.spyOn(Recipe, "findOneAndUpdate").mockResolvedValueOnce(recipeMock);

    await favoriteRecipe(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ id: "user123" });
    expect(Recipe.findOne).toHaveBeenCalledWith({ id: "recipe123" });

    expect(Recipe.findOneAndUpdate).toHaveBeenCalledWith(
      { id: "recipe123" },
      { is_favorite: false }
    );
    expect(userMock.favorites).toEqual(["recipe123"]);
    expect(userMock.save).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[200]);
    expect(next).not.toHaveBeenCalled();
  });

  it("should send a 500 response if an error occurs during favoriteRecipe", async () => {
    jest.spyOn(User, "findOne").mockRejectedValueOnce(new Error("Mock error"));

    await favoriteRecipe(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ id: "user123" });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
    expect(next).not.toHaveBeenCalled();
  });

  it("should send a 500 response if an error occurs during recipe retrieval", async () => {
    const userMock = {
      favorites: [],
      save: jest.fn(),
    };
    jest.spyOn(User, "findOne").mockResolvedValueOnce(userMock);
    jest
      .spyOn(Recipe, "findOne")
      .mockRejectedValueOnce(new Error("Mock error"));

    await favoriteRecipe(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ id: "user123" });
    expect(Recipe.findOne).toHaveBeenCalledWith({ id: "recipe123" });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
    expect(next).not.toHaveBeenCalled();
  });
});
