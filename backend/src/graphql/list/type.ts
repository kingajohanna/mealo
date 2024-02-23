export const listType = `
  input ListItemInput {
    id: String
    name: String
    amount: String
    completed: Boolean
  }

  type ListItem {
    id: String
    name: String
    amount: String
    completed: Boolean
  }

  type List {
    id: String
    uid: String
    list: [ListItem]
  }

  type Query {
    getList: List
  }

  type Mutation {
    addToList(name: String!, amount: String!, id: String, completed: Boolean): List
    completeTask(id: String!, completed: Boolean!): List
    changeTasks(tasks: [ListItemInput]!): List
    deleteTask(id: String!): List
  }
`;
