import { firebase, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';

/*

 recipeid - timerid - start time - duration
*/

export type RecipeTimer = {
  id: string;
  endDate: moment.Moment;
  duration: number;
  title: string;
};

export default class TimerStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  timers: RecipeTimer[] = [];

  cleanTimers() {
    this.timers = this.timers.filter((timer) => timer.endDate.isAfter(moment()));
  }

  addTimer(timer: RecipeTimer) {
    this.removeTimer(timer.id);
    this.timers.push(timer);
  }

  removeTimer(id: string) {
    this.timers = this.timers.filter((timer) => timer.id !== id);
  }
}
