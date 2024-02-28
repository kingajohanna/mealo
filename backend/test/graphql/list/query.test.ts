import exp from "constants";
import { listMutation, listQuery } from "../../../src/graphql/list";
import { ContextType } from "../../../src/graphql/types";
import { contextMock } from "../mocks/mocks";

describe("User Queries", () => {
  let context: ContextType;

  beforeAll(async () => {
    context = contextMock;
  });

  test("getList empty query", async () => {
    const args = {};

    const result = await listQuery.getList(null, args, context);

    expect(result?.list).toHaveLength(0);
  });

  test("getList query", async () => {
    await listMutation.addToList(
      null,
      { name: "test", amount: "1g", completed: false, id: "0" },
      context
    );
    await listMutation.addToList(
      null,
      { name: "test", amount: "1g", completed: true, id: "1" },
      context
    );

    const args = {};

    const result = await listQuery.getList(null, args, context);

    expect(result?.list).toHaveLength(2);
  });
});
