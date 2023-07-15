import {makeAutoObservable, runInAction} from 'mobx';

import {Recipe} from '../types/recipe';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  editFavRecipe,
  addRecipe,
  deleteRecipe,
  getRecipes,
  setRecipe,
} from '../api/backend';

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
    recipes?.map(recipe => {
      if (recipe.category && !categories.includes(recipe.category)) {
        categories.push(recipe.category);
      }
      if (recipe.cuisine && !cuisines.includes(recipe.cuisine)) {
        cuisines.push(recipe.cuisine);
      }
    });

    runInAction(() => {
      this.recipes = recipes!;
      this.categories = categories;
      this.cuisines = cuisines;
    });
  }

  async setFavourites() {
    const favs = this.recipes?.filter(recipe => recipe.is_favorite === true);

    runInAction(() => {
      this.favourites = favs;
    });
  }

  async refresh() {
    await this.setRecipes();
    this.setFavourites();
  }

  async addRecipe(url: string) {
    await addRecipe(url);
    await this.refresh();
  }

  async removeRecipe(recipeID: string) {
    await deleteRecipe(recipeID);
    await this.refresh();
  }

  removeRecipes() {
    this.recipes = [];
  }

  getRecipes() {
    return this.recipes;
  }

  async editRecipe(recipeID: string, body: any) {
    const modifiedRecipe = await setRecipe(recipeID, body);
    await this.refresh();
    return modifiedRecipe;
  }

  async editFav(recipeID: string) {
    await editFavRecipe(recipeID);
    return await this.refresh();
  }
}
