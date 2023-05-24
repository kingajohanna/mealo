import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { addRecipe } from "../../src/middlewares/recipe";
import { User } from "../../src/models/User";
import { Recipe } from "../../src/models/Recipe";
import { HTTPResponse } from "../../src/const/HttpRespone";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";

let mongoServer: MongoMemoryServer;
let mongoUri: string;

describe("addRecipe", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Recipe.deleteMany({});
  });

  beforeEach(() => {
    req = {
      body: {
        url: "https://example.com/recipe",
      },
    } as Request;

    res = {
      locals: {
        uid: "user123",
      },
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    next = jest.fn();

    jest.spyOn(User, "findOne").mockResolvedValue({ recipes: [] });
    jest.spyOn(axios, "post").mockResolvedValue({
      data: {
        id: "recipe123",
        title: "Example Recipe",
      },
    });
  });

  it("should add a recipe when user exists and recipe does not exist", async () => {
    const userSaveMock = jest.fn();
    const userFindOneMock = User.findOne as jest.Mock;
    userFindOneMock.mockResolvedValue({
      recipes: [],
      save: userSaveMock,
    });

    await addRecipe(req, res, next);

    expect(userFindOneMock).toHaveBeenCalledWith({ id: "user123" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[201]);
    expect(userSaveMock).toHaveBeenCalled();

    const savedRecipe = await Recipe.findOne({ id: "recipe123" });
    expect(savedRecipe).toBeDefined();
    expect(savedRecipe?.title).toBe("Example Recipe");
  });

  it("should send a 500 response if an error occurs during the recipe save", async () => {
    const userFindOneMock = User.findOne as jest.Mock;
    userFindOneMock.mockResolvedValue({
      recipes: [],
    });

    jest
      .spyOn(Recipe.prototype, "save")
      .mockRejectedValueOnce(new Error("Save error"));

    await addRecipe(req, res, next);

    expect(userFindOneMock).toHaveBeenCalledWith({ id: "user123" });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
  });

  it("should send a 500 response if an error occurs during the external API call", async () => {
    const userFindOneMock = User.findOne as jest.Mock;
    userFindOneMock.mockResolvedValue({
      recipes: [],
    });

    jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("API error"));

    await addRecipe(req, res, next);

    expect(userFindOneMock).toHaveBeenCalledWith({ id: "user123" });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
  });

  it("should send a 500 response if the user does not exist", async () => {
    const userFindOneMock = User.findOne as jest.Mock;
    userFindOneMock.mockResolvedValue(null);

    await addRecipe(req, res, next);

    expect(userFindOneMock).toHaveBeenCalledWith({ id: "user123" });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
  });
});
