import auth from '@react-native-firebase/auth';
import {Recipe} from '../types/recipe';
import {BACKEND_URL} from '@env';

const baseUrl = `http://${BACKEND_URL}:3000/`;

const endpoints = {
  addRecipe: 'recipe/add',
  getRecipe: 'recipe/get',
  addFavRecipe: 'recipe/favorite/',
  addUser: 'user/add',
  deleteUser: 'user/delete',
  setRecipe: 'recipe/edit/',
  deleteRecipe: 'recipe/delete/',
};

const fetchWithAuthorization = async (
  url: string,
  method: string,
  body?: any,
  responseIsJson = false,
) => {
  try {
    const response = await fetch(baseUrl + url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (responseIsJson) return await response.json();
    return response;
  } catch (error) {
    console.log(url, error);
  }
};

export const addRecipe = async (url: string) => {
  return await fetchWithAuthorization(endpoints.addRecipe, 'PUT', {url});
};

export const editFavRecipe = async (recipeID: string) => {
  return await fetchWithAuthorization(
    endpoints.addFavRecipe + recipeID + '/',
    'POST',
  );
};

export const getRecipes = async () => {
  return (await fetchWithAuthorization(
    endpoints.getRecipe,
    'GET',
    undefined,
    true,
  )) as Recipe[];
};

export const setRecipe = async (recipeID: string, body: any) => {
  return (await fetchWithAuthorization(
    endpoints.setRecipe + recipeID,
    'POST',
    body,
    true,
  )) as Recipe;
};

export const deleteRecipe = async (recipeID: string) => {
  await fetchWithAuthorization(endpoints.deleteRecipe + recipeID, 'DELETE');
};

export const addUser = async () => {
  return await fetchWithAuthorization(endpoints.addUser, 'PUT');
};

export const deleteUser = async () => {
  return await fetchWithAuthorization(endpoints.deleteUser, 'DELETE');
};
