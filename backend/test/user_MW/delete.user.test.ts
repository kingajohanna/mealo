import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import { User } from "../../src/models/User";
import { Recipe } from "../../src/models/Recipe";
import { deleteUser } from "../../src/middlewares/user";
import { HTTPResponse } from "../../src/const/HttpRespone";

let mongoServer: MongoMemoryServer;
let mongoUri: string;

describe("deleteUser", () => {
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
    req = {} as Request;
    res = {
      locals: {
        uid: "user-id",
      },
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it("should delete user and associated recipes", async () => {
    Recipe.deleteMany = jest.fn().mockResolvedValue({ deletedCount: 2 });
    User.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });

    await deleteUser(req, res, next);

    expect(Recipe.deleteMany).toHaveBeenCalledWith({ uid: "user-id" });
    expect(User.deleteOne).toHaveBeenCalledWith({ id: "user-id" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[200]);
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle errors and return 500 status", async () => {
    const error = new Error("Database error");
    Recipe.deleteMany = jest.fn().mockRejectedValue(error);

    await deleteUser(req, res, next);

    expect(Recipe.deleteMany).toHaveBeenCalledWith({ uid: "user-id" });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[500]);
    expect(next).not.toHaveBeenCalled();
  });
});
