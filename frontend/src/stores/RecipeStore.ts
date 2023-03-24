import {makeAutoObservable, runInAction} from 'mobx';

import {Recipe, testRecipe} from '../types/recipe';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addRecipe, getRecipes} from '../contants/backend';

export const all = 'All';
export default class RecipeStore {
  recipes: Recipe[] = [];
  favourites: Recipe[] = [];
  categories: string[] = [all, 'ebéd', 'vacsi'];
  cuisines: string[] = [all, 'kínai', 'olasz'];

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
    makePersistable(this, {
      name: 'RecipeStore',
      properties: ['recipes', 'favourites', 'categories', 'cuisines'],
      storage: AsyncStorage,
    });
  }

  async setRecipes() {
    const recipes = await getRecipes();
    const categories: string[] = [all];
    const cuisines: string[] = [all];
    recipes.map(recipe => {
      if (recipe.category && !categories.includes(recipe.category))
        categories.push(recipe.category);
      if (recipe.cuisine && !cuisines.includes(recipe.cuisine))
        cuisines.push(recipe.cuisine);
    });

    runInAction(() => {
      this.recipes = recipes;
      this.categories = categories;
      this.cuisines = cuisines;
    });
  }

  async refresh() {
    await this.setRecipes();
  }

  async addRecipe(url: string) {
    await addRecipe(url);
    this.refresh();
  }

  removeRecipes() {
    this.recipes = [];
  }

  getRecipes() {
    return this.recipes;
  }

  async addFav(recipeID: string) {
    await addRecipe(recipeID);
    this.refresh();
  }
}
