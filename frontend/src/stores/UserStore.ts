import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export default class UserStore {
  constructor() {
    makeAutoObservable(this);

    makePersistable(this, {
      name: 'UserStore',
      properties: ['showCompletedTasks', 'addIngredientsAutomatically'],
      storage: AsyncStorage,
    });
  }

  isLoggedIn = false;
  user: FirebaseAuthTypes.User | undefined = undefined;
  loading = false;
  showCompletedTasks = true;
  addIngredientsAutomatically = false;

  setIsLoggedIn(login: boolean) {
    this.isLoggedIn = login;
    this.setUser(firebase.auth().currentUser || undefined);
  }

  setUser(user: FirebaseAuthTypes.User | undefined) {
    this.user = user;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setShowCompletedTasks(value: boolean) {
    this.showCompletedTasks = value;
  }

  setAddIngredientsAutomatically(value: boolean) {
    this.addIngredientsAutomatically = value;
  }
}
