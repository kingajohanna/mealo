export const userType = `
  type Share {
    recipe: Int
    from: String
    id: String
  }

  type User {
    id: String
    email: String
    share: [Share]
  }

  type Query {
    getUser: User
  }

  type Mutation {
    addUser: User
    deleteUser: User
    shareRecipe(recipeId: Int!, email: String!): Share
    manageShare(shareId: String!, id: Int!, accept: Boolean!): User
    bingAnalyzer(text: String!): String
  }
`;
