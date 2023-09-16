import UserStore from './UserStore';

export default class RootStore {
  userStore: UserStore;

  constructor() {
    this.userStore = new UserStore();
  }
}
