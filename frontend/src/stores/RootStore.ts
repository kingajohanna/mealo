import RecipeStore from './RecipeStore';
import UserStore from './UserStore';

export default class RootStore {
  userStore: UserStore;
  recipeStore: RecipeStore;

  constructor() {
    this.userStore = new UserStore();
    this.recipeStore = new RecipeStore();
  }
}
