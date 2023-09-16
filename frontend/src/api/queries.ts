import {gql} from '@apollo/client';

export const GET_RECIPES = gql`
  query GetRecipes {
    getRecipes {
      categories
      cuisines
      recipes {
        id
        title
        category
        speed
        totalTime
        yields
        image
        ingredients
        instructions
        cuisine
        is_favorite
      }
    }
  }
`;
