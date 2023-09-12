import { userType, userQuery, userMutation } from "./users";

import { recipeType, recipeQuery, recipeMutation } from "./recipe";

export const typeDefs = `#graphql
  ${userType}

  ${recipeType}
`;

// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    ...userQuery,
    ...recipeQuery,
  },
  Mutation: {
    ...userMutation,
    ...recipeMutation,
  },
};
