import { gql } from '@apollo/client';

export const requiredData = `
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
      description
      folders
      video
      siteName
      meals {
        meal
        day
        id
      }
      `;

export const GET_RECIPES = gql`
  query GetRecipes {
    getRecipes {
      categories
      cuisines
      folders
      recipes {
        ${requiredData}
      }
    }
  }
`;

export const GET_LIST = gql`
  query GetList {
    getList {
      id
      uid
      list {
        id
        name
        amount
        completed
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      email
      share {
        id
        recipe
        from
      }
    }
  }
`;

export const GET_RECIPE = gql`
  query GetRecipe($recipeId: Int!) {
    getRecipe(recipeId: $recipeId) {
      ${requiredData}
    }
  }
`;
