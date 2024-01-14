import { firebase, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { makeAutoObservable } from 'mobx';

export default class UserStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  isLoggedIn = false;
  user: FirebaseAuthTypes.User | undefined = undefined;
  loading = false;
  showCompletedTasks = true;

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
}
