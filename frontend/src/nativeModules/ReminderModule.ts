import { NativeModules, Platform } from 'react-native';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

const { ReminderModule } = NativeModules;

export type Reminder = {
  id?: string;
  title: string;
  notes: string;
  completed: boolean;
};

export const fetchReminders = async (): Promise<Reminder[] | undefined> => {
  if (Platform.OS === 'ios')
    try {
      return await ReminderModule.fetchReminders();
    } catch (error: any) {
      throw new Error('Error fetching reminders: ' + error.message);
    }
};

export const createCalendar = async (): Promise<string | undefined> => {
  if (Platform.OS === 'ios')
    try {
      return await ReminderModule.createCalendar();
    } catch (error: any) {
      throw new Error('Error create calendar: ' + error.message);
    }
};

export const addReminder = async (title: string, note: string): Promise<Reminder | undefined> => {
  if (Platform.OS === 'ios')
    try {
      return await ReminderModule.addReminder(title, note);
    } catch (error: any) {
      throw new Error('Error adding reminder: ' + error.message);
    }
};

export const setReminderCompleted = async (id: string, completed: number): Promise<Reminder | undefined> => {
  if (Platform.OS === 'ios')
    try {
      return await ReminderModule.completeReminder(id, completed);
    } catch (error: any) {
      throw new Error('Error adding reminder: ' + error.message);
    }
};

export const fetchCalendarEvents = async () => {
  if (Platform.OS === 'ios')
    try {
      return await ReminderModule.fetchEvents();
    } catch (error: any) {
      throw new Error('Error fetching calendar events: ' + error.message);
    }
};

export const addCalendarEvent = async (title: string, startDate: Double, endDate: Double) => {
  if (Platform.OS === 'ios')
    try {
      return await ReminderModule.addEvent(title, startDate, endDate);
    } catch (error: any) {
      throw new Error('Error adding calendar event: ' + error.message);
    }
};
