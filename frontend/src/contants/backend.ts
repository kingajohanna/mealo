import auth from '@react-native-firebase/auth';
import {Recipe} from '../types/recipe';

const baseUrl = 'http://127.0.0.1:3000/';

export const addRecipeURL = baseUrl + 'recipe/add';

export const getRecipeURL = baseUrl + 'recipe/get';

export const addUserURL = baseUrl + 'user/add';

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
    console.log('addrecipe', response);

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
    const data = (await response.json()) as Recipe[];
    console.log('getrecipe', data);

    return data;
  } catch (error) {
    console.log(error);
  }
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
  console.log('adduser', response);

  return response;
};
