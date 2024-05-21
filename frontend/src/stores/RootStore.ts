import TimerStore from './TimerStore';
import UserStore from './UserStore';

export default class RootStore {
  timerStore: TimerStore;
  userStore: UserStore;
  constructor() {
    this.userStore = new UserStore();
    this.timerStore = new TimerStore();
  }
}
