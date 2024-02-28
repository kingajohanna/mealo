import { listMutation } from "../../../src/graphql/list";
import { ContextType } from "../../../src/graphql/types";
import { contextMock } from "../mocks/mocks";

describe("List Mutations", () => {
  let context: ContextType;

  beforeAll(async () => {
    context = contextMock;
  });

  test("addToList mutation", async () => {
    const args = { name: "test", amount: "1g", completed: false, id: "1" };

    const result = await listMutation.addToList(null, args, context);
    expect(result?.list).toContainEqual(args);
  });

  test("addToList without id mutation", async () => {
    const args = { name: "test", amount: "1g", completed: true };

    const result = await listMutation.addToList(null, args, context);
    expect(result?.list).toHaveLength(2);
  });

  test("completeTask mutation", async () => {
    const args = { id: "1", completed: true };

    const result = await listMutation.completeTask(null, args, context);
    expect(result?.list[0].completed).toBe(true);
  });

  test("changeTasks mutation", async () => {
    const args = {
      tasks: [{ id: "1", name: "test2", amount: "1g", completed: false }],
    };

    const result = await listMutation.changeTasks(null, args, context);
    expect(result?.list).toContainEqual(args.tasks[0]);
  });

  test("deleteList mutation", async () => {
    const args = { id: "1" };

    const result = await listMutation.deleteTask(null, args, context);
    expect(result?.list).toHaveLength(0);
  });
});
