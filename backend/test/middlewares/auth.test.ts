import { Request, Response } from "express";
import * as firebase from "firebase-admin";
import { authenticateToken } from "../../src/middlewares/auth";

jest.mock("firebase-admin", () => ({
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
  })),
}));

describe("authenticateToken", () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
  });

  it("should return 401 if no token is provided", () => {
    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("should call verifyIdToken with the provided token", () => {
    req.headers = { authorization: "your-token-here" };

    authenticateToken(req, res, next);

    expect(firebase.auth().verifyIdToken).toHaveBeenCalledWith(
      "your-token-here"
    );
  });

  it("should return 401 if token verification fails", async () => {
    const verifyIdTokenMock = jest
      .fn()
      .mockRejectedValue(new Error("Token expired"));
    firebase.auth().verifyIdToken = verifyIdTokenMock;

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Token expired");
  });
});
