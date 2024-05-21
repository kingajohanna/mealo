import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export default class UserStore {
  private user: FirebaseAuthTypes.User | undefined = undefined;
  isLoggedIn = false;
  loading = false;
  addIngredientsAutomatically = false;
  showCompletedTasks = true;
  showCategoryFolders = true;
  showCuisineFolders = true;

  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'UserStore',
      properties: ['showCompletedTasks', 'addIngredientsAutomatically', 'showCategoryFolders', 'showCuisineFolders'],
      storage: AsyncStorage,
    });
  }

  private setUser(user: FirebaseAuthTypes.User | undefined) {
    this.user = user;
  }

  setAddIngredientsAutomatically(value: boolean) {
    this.addIngredientsAutomatically = value;
  }

  setIsLoggedIn(login: boolean) {
    this.isLoggedIn = login;
    this.setUser(firebase.auth().currentUser || undefined);
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setShowCompletedTasks(value: boolean) {
    this.showCompletedTasks = value;
  }

  setShowCategoryFolders(value: boolean) {
    this.showCategoryFolders = value;
  }

  setShowCuisineFolders(value: boolean) {
    this.showCuisineFolders = value;
  }
}
