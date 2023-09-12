import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import { User } from "../../src/models/User";
import { addUser } from "../../src/middlewares/user";
import { HTTPResponse } from "../../src/const/HttpRespone";

let mongoServer: MongoMemoryServer;
let mongoUri: string;

describe("addUser", () => {
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
  });

  beforeEach(() => {
    req = {} as Request;
    res = {
      locals: {
        email: "test@example.com",
        uid: "123456789",
      },
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    next = jest.fn();

    jest.spyOn(User, "find").mockResolvedValue([]);
  });

  it("should create a new user if user with given UID does not exist", async () => {
    User.prototype.save = jest.fn();

    await addUser(req, res, next);

    expect(User.find).toHaveBeenCalledWith({ id: "123456789" });
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenLastCalledWith(HTTPResponse[201]);
    expect(next).not.toHaveBeenCalled();
  });

  it("should send a 200 response when user with given UID already exists", async () => {
    const mockUser = {
      id: "123456789",
      email: "test@example.com",
    };
    User.find = jest.fn().mockResolvedValue([mockUser]);

    await addUser(req, res, next);

    expect(User.find).toHaveBeenCalledWith({ id: "123456789" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(HTTPResponse[200]);
    expect(next).not.toHaveBeenCalled();
  });

  it("should send a 500 response if an error occurs while saving the user", async () => {
    User.prototype.save = jest
      .fn()
      .mockRejectedValueOnce(new Error("Save error"));

    await addUser(req, res, next);

    expect(User.find).toHaveBeenCalledWith({ id: "123456789" });
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenLastCalledWith(HTTPResponse[500]);
    expect(next).not.toHaveBeenCalled();
  });
});