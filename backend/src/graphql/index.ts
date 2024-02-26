import { GraphQLUpload } from "graphql-upload-minimal";
import { listMutation, listQuery, listType } from "./list";
import { userMutation, userQuery, userType } from "./user";
import { recipeMutation, recipeQuery, recipeType } from "./recipe";

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
