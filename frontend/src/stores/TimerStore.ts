import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
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
  timers: RecipeTimer[] = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'TimerStore',
      properties: ['timers'],
      storage: AsyncStorage,
    });
  }

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
