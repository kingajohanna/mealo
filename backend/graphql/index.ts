import { userType } from "./users";
import { userResolvers } from "./users";
import { recipeType } from "./recipe";
import { recipeResolvers } from "./recipe";

export const typeDefs = `#graphql
  ${userType}

  ${recipeType}
`;

// A map of functions which return data for the schema.
export const resolvers = {
  Query: {
    ...userResolvers,
    ...recipeResolvers,
  },
};
