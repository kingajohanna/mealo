import { ContextType } from "../../../src/graphql/types";
import { userMutation, userQuery } from "../../../src/graphql/user";
import { contextMock } from "../mocks/mocks";

describe("User Queries", () => {
  let context: ContextType;

  beforeAll(async () => {
    context = contextMock;
    await userMutation.addUser(null, {}, context);
  });

  test("getUser query", async () => {
    const args = {};

    const result = await userQuery.getUser(null, args, context);
    expect(result?.email).toBe(context.email);
  });
});
