import auth from '@react-native-firebase/auth';
import {Recipe} from '../types/recipe';

const baseUrl = 'http://127.0.0.1:3000/';

export const addRecipeURL = baseUrl + 'recipe/add';

export const getRecipeURL = baseUrl + 'recipe/get';

export const addUserURL = baseUrl + 'user/add';

export const setRecipeURL = baseUrl + 'recipe/edit/';

export const addRecipe = async (url: string) => {
  try {
    const token = await auth().currentUser?.getIdToken(true);

    const response = await fetch(addRecipeURL, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: token!,
      },
      body: JSON.stringify({
        url: url,
      }),
    });
    console.log(addRecipeURL + response.status);

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getRecipes = async () => {
  try {
    const token = await auth().currentUser?.getIdToken();

    const response = await fetch(getRecipeURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: token!,
      },
    });
    console.log(getRecipeURL + response.status);

    return (await response.json()) as Recipe[];
  } catch (error) {
    console.log(error);
  }
};

export const setRecipe = async (recipeID: string, body: any) => {
  const token = await auth().currentUser?.getIdToken(true);

  const url = setRecipeURL + recipeID;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token!,
    },
    body: JSON.stringify(body),
  });

  console.log(url + response.status);

  return (await response.json()) as Recipe;
};

export const addUser = async () => {
  const token = await auth().currentUser?.getIdToken(true);

  const response = await fetch(addUserURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token!,
    },
  });
  console.log(addUserURL + response.status);

  return response;
};
