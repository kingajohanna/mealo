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

export const EDIT_RECIPE = gql`
  mutation EditRecipe($recipeId: Int!, $body: RecipeInput!) {
    editRecipe(recipeId: $recipeId, body: $body) {
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
`;

export const ADD_USER = gql`
  mutation AddUser {
    addUser {
      id
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      id
      email
    }
  }
`;

export const ADD_RECIPE = gql`
  mutation AddRecipe($url: String!) {
    addRecipe(url: $url) {
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
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($recipeId: Int!) {
    deleteRecipe(recipeId: $recipeId) {
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
`;

export const FAVORITE_RECIPE = gql`
  mutation FavoriteRecipe($recipeId: Int!) {
    favoriteRecipe(recipeId: $recipeId) {
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
`;
