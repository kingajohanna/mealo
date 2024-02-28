import { ContextType } from "../../../src/graphql/types";
import { userMutation } from "../../../src/graphql/user";
import { Recipe } from "../../../src/models/Recipe";
import { contextMock, recipeMock } from "../mocks/mocks";

describe("User Mutations", () => {
  let context: ContextType;

  beforeAll(() => {
    context = contextMock;
  });

  test("addUser mutation", async () => {
    const args = {};

    const result = await userMutation.addUser(null, args, context);
    expect(result?.email).toBe(context.email);
  });

  test("deleteUser mutation", async () => {
    const args = {};

    const result = await userMutation.deleteUser(null, args, context);
    expect(result?.email).toBe(context.email);
  });

  test("shareRecipe mutation", async () => {
    const args = { recipeId: 1, email: context.email };

    const result = await userMutation.shareRecipe(null, args, context);

    expect(result?.from).toBe(context.email);
  });

  describe("manageShare accept mutation", () => {
    let shareId: string;
    beforeAll(async () => {
      await userMutation.addUser(null, {}, context);
      const args = { recipeId: 1, email: context.email };

      const result = await userMutation.shareRecipe(null, args, context);
      shareId = result?.id;

      await new Recipe({ ...recipeMock }).save();
    });

    test("accepts the share for the custom recipe", async () => {
      const args = { shareId: shareId, id: 1, accept: true };

      const result = await userMutation.manageShare(null, args, context);

      expect(result).toBeDefined();
    });
  });
});
