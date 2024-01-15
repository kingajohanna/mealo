import { gql } from '@apollo/client';

export const GET_RECIPES = gql`
  query GetRecipes {
    getRecipes {
      categories
      cuisines
      folders
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
        siteName
        difficulty
        calories
        ratings
        folders
        meals {
          meal
          day
          id
        }
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
      siteName
      difficulty
      calories
      ratings
      folders
      meals {
        meal
        day
        id
      }
    }
  }
`;
