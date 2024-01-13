import { gql } from '@apollo/client';

const requiredData = `
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
      folders
      meals {
        meal
        day
        id
      }
      `;

export const EDIT_RECIPE = gql`
  mutation EditRecipe($recipeId: Int!, $body: RecipeInput!) {
    editRecipe(recipeId: $recipeId, body: $body) {
      ${requiredData}
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
      ${requiredData}
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($recipeId: Int!) {
    deleteRecipe(recipeId: $recipeId) {
      ${requiredData}
    }
  }
`;

export const FAVORITE_RECIPE = gql`
  mutation FavoriteRecipe($recipeId: Int!) {
    favoriteRecipe(recipeId: $recipeId) {
      ${requiredData}
    }
  }
`;

export const ADD_OCR_RECIPE = gql`
  mutation AddOcrRecipe($recipe: RecipeInput!, $image: Upload) {
    addOcrRecipe(recipe: $recipe, image: $image) {
      ${requiredData}
    }
  }
`;

export const FOLDER_RECIPE = gql`
  mutation FolderRecipe($recipeId: Int!, $folders: [String]) {
    folderRecipe(recipeId: $recipeId, folders: $folders) {
      ${requiredData}
    }
  }
`;

export const ADD_MEAL = gql`
  mutation AddMeal($recipeId: Int!, $meal: MealInput!) {
    addMeal(recipeId: $recipeId, meal: $meal) {
      ${requiredData}
    }
  }
`;

export const REMOVE_MEAL = gql`
  mutation RemoveMeal($recipeId: Int!, $mealId: String!) {
    removeMeal(recipeId: $recipeId, mealId: $mealId) {
      ${requiredData}
    }
  }
`;

export const ADD_LIST = gql`
  mutation AddToList($name: String!, $amount: String!) {
    addToList(name: $name, amount: $amount) {
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

export const COMPLETE_TASK = gql`
  mutation CompleteTask($id: String!, $currentCompleted: Boolean!) {
    completeTask(id: $id, currentCompleted: $currentCompleted) {
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
