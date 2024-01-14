import { userType, userQuery, userMutation } from "./users";
import { recipeType, recipeQuery, recipeMutation } from "./recipe";
import { listType, listQuery, listMutation } from "./list";

import { GraphQLUpload } from "graphql-upload-minimal";

export const typeDefs = `#graphql
  ${userType}

  ${recipeType}

  ${listType}
`;

// A map of functions which return data for the schema.
export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    ...userQuery,
    ...recipeQuery,
    ...listQuery,
  },
  Mutation: {
    ...userMutation,
    ...recipeMutation,
    ...listMutation,
  },
};
