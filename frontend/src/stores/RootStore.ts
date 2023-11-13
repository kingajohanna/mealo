import TimerStore from './TimerStore';
import UserStore from './UserStore';

export default class RootStore {
  userStore: UserStore;
  timerStore: TimerStore;

  constructor() {
    this.userStore = new UserStore();
    this.timerStore = new TimerStore();
  }
}
