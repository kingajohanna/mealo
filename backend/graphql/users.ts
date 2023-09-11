export const userType = `
  type User {
    id: Int
    email: String
    recipes: [Recipe]
    favorites: [Recipe]
  }

  type Query {
    getUser: [User]
  }
`;

const mockUser = {
  id: 1,
  email: "user@example.com",
  recipes: [
    {
      id: 1,
      title: "Recipe 1",
    },
    {
      id: 2,
      title: "Recipe 2",
    },
  ],
  favorites: [
    {
      id: 3,
      title: "Recipe 3",
    },
  ],
};

// A map of functions which return data for the schema.
export const userResolvers = {
  getUser() {
    return [mockUser];
  },
};
