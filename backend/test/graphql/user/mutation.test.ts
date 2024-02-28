import { ContextType } from "../../../src/graphql/types";
import { userMutation } from "../../../src/graphql/user";
import { contextMock } from "../mocks/mocks";

describe("User Mutations", () => {
  let context: ContextType;

  beforeEach(() => {
    context = contextMock;
  });

  test("addUser mutation", async () => {
    const args = {};

    const result = await userMutation.addUser(null, args, context);
    expect(result).toBeDefined();
  });

  test("deleteUser mutation", async () => {
    const args = {};

    const result = await userMutation.deleteUser(null, args, context);
    expect(result).toBeDefined();
  });

  test("shareRecipe mutation", async () => {
    const args = { recipeId: 1, email: "email" };

    const result = await userMutation.shareRecipe(null, args, context);
    expect(result).toBeDefined();
  });

  test("manageShare mutation", async () => {
    const args = { shareId: "shareId", id: 1, accept: false };

    const result = await userMutation.manageShare(null, args, context);
    expect(result).toBeDefined();
  });
});
