import { Colors } from '../theme/colors';
import { ScreenBackground } from '../components/Background';
import { StyleSheet, Text, View } from 'react-native';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import { useStore } from '../stores';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { RecipeTimer } from '../stores/TimerStore';
import { TextInput } from '../components/TextInput';
import { observer } from 'mobx-react-lite';
import { Recipe } from '../types/recipe';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import moment from 'moment';

type Props = { recipe: Recipe; onClose: () => void };

export const Timers: React.FC<Props> = observer(({ recipe, onClose }) => {
  const { timerStore } = useStore();

  const [timer, setTimer] = useState<RecipeTimer | undefined>(undefined);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [title, setTitle] = useState(recipe.title);
  const [remainingTime, setRemainingTime] = useState<undefined | number>(undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!timer?.endDate) return;
      if (remainingTime === 1) {
        setTimer(undefined);
        setRemainingTime(undefined);
      } else setRemainingTime(timer.endDate.diff(moment(), 'seconds'));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, timer?.endDate]);

  useEffect(() => {
    timerStore.cleanTimers();
  }, []);

  useEffect(() => {
    const timer = timerStore.timers.filter((timer) => timer.id === recipe.id);
    setTimer(timer[0]);
    setRemainingTime(timer[0]?.endDate.diff(moment(), 'seconds'));
  }, [timerStore.timers]);

  const addTimer = async () => {
    const date = moment();

    const duration = 60 * hours + minutes;

    date.add(hours, 'hours').add(minutes, 'minutes');

    const timer: RecipeTimer = { id: recipe.id, endDate: date, duration: duration * 60, title };
    timerStore.addTimer(timer);

    await onDisplayNotification(timer);
  };

  const onDisplayNotification = async (timer: RecipeTimer) => {
    await notifee.requestPermission();

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: timer.endDate.valueOf(),
    };

    await notifee.createTriggerNotification(
      {
        title,
        android: {
          channelId: 'recipe timer',
        },
      },
      trigger,
    );
  };

  const renderMinutes = () => {
    const minutes = [];

    for (let i = 0; i < 60; i++) {
      minutes.push(<Picker.Item label={i.toString()} value={i} key={`minutes${i}`} />);
    }

    return minutes;
  };

  const renderHours = () => {
    const hours = [];
    for (let i = 0; i < 23; i++) {
      hours.push(<Picker.Item label={i.toString()} value={i} key={`hours${i}`} />);
    }

    return hours;
  };

  const renderAddTimer = () => {
    return (
      <>
        <Text style={styles.title}>Add timer</Text>
        <TextInput onChangeText={setTitle} text={title} placeholder="Title" style={{ width: '80%' }} />
        <View style={styles.pickerContainer}>
          <Picker style={styles.picker} selectedValue={hours} onValueChange={(itemValue) => setHours(itemValue)}>
            {renderHours()}
          </Picker>
          <Text style={styles.text}>{hours > 1 ? 'hours' : 'hour  '}</Text>
          <Picker style={styles.picker} selectedValue={minutes} onValueChange={(itemValue) => setMinutes(itemValue)}>
            {renderMinutes()}
          </Picker>
          <Text style={styles.text}>{minutes > 1 ? 'minutes' : 'minute  '}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={onClose} title={'Go back'} style={styles.backButton} titleStyle={styles.backButtonText} />
          <Button
            onPress={() => {
              addTimer();
            }}
            disabled={hours === 0 && minutes === 0}
            title={'Add timer'}
            style={styles.nextButton}
            titleStyle={styles.nextButtonText}
          />
        </View>
      </>
    );
  };

  const renderTimer = () => {
    return (
      remainingTime && (
        <>
          <Text style={styles.title}>{timer?.title}</Text>

          <AnimatedCircularProgress
            size={200}
            width={5}
            backgroundWidth={5}
            fill={(remainingTime! / timer?.duration!) * 100}
            tintColor={Colors.salmon}
            backgroundColor={Colors.pine}
            style={styles.timerContainer}
          >
            {() => <Text style={styles.points}>{moment.utc(remainingTime! * 1000).format('HH:mm:ss')}</Text>}
          </AnimatedCircularProgress>

          <View style={styles.buttonContainer}>
            <Button onPress={onClose} title={'Close'} style={styles.backButton} titleStyle={styles.backButtonText} />
            <Button
              onPress={() => {
                timerStore.removeTimer(recipe.id);
              }}
              disabled={!timer}
              title={'Stop timer'}
              style={styles.nextButton}
              titleStyle={styles.nextButtonText}
            />
          </View>
        </>
      )
    );
  };

  return (
    <ScreenBackground fullscreen notificationBarColor={Colors.beige}>
      {timer ? renderTimer() : renderAddTimer()}
    </ScreenBackground>
  );
});

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.pine,
    paddingBottom: 20,
    textAlign: 'center',
  },
  timerContainer: {
    marginVertical: 30,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: 100,
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textDark,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: Colors.beige,
    width: '50%',
    height: 50,
    borderColor: Colors.salmon,
    borderWidth: 2,
  },
  backButtonText: {
    textAlign: 'center',
    color: Colors.salmon,
    fontSize: 20,
    fontWeight: 'bold',
  },
  points: {
    textAlign: 'center',
    color: Colors.pine,
    fontSize: 40,
    fontWeight: '100',
  },
  nextButton: {
    backgroundColor: Colors.salmon,
    width: '50%',
    height: 50,
  },
  nextButtonText: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
  },
});
