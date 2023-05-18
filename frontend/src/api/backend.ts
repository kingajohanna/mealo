import auth from '@react-native-firebase/auth';
import {Recipe} from '../types/recipe';
import {BACKEND_URL} from '@env';

const baseUrl = `http://${BACKEND_URL}:3000/`;

const addRecipeURL = baseUrl + 'recipe/add';

const getRecipeURL = baseUrl + 'recipe/get';

const addFavRecipeURL = baseUrl + 'recipe/favorite/';

const addUserURL = baseUrl + 'user/add';

const deleteUserURL = baseUrl + 'user/delete';

const setRecipeURL = baseUrl + 'recipe/edit/';

const deleteRecipeURL = baseUrl + 'recipe/delete/';

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

export const editFavRecipe = async (recipeID: string) => {
  const token = await auth().currentUser?.getIdToken(true);

  const url = addFavRecipeURL + recipeID + '/';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token!,
    },
  });
  console.log('addfav', response);

  return response;
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

export const deleteRecipe = async (recipeID: string) => {
  const token = await auth().currentUser?.getIdToken(true);

  const url = deleteRecipeURL + recipeID;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token!,
    },
  });

  console.log(url + response.status);

  return (await response.json()) as Recipe;
};

export const addUser = async () => {
  const token = await auth().currentUser?.getIdToken(true);

  const response = await fetch(addUserURL, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token!,
    },
  });
  console.log(addUserURL + response.status);

  return response;
};

export const deleteUser = async () => {
  const token = await auth().currentUser?.getIdToken(true);

  const response = await fetch(deleteUserURL, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: token!,
    },
  });
  console.log(deleteUserURL + response.status);

  return response;
};
