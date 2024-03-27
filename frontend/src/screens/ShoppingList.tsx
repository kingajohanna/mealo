import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { GET_LIST } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import i18next, { use } from 'i18next';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { ListItem } from '../types/list';
import { ADD_LIST, COMPLETE_TASK, DELETE_TASK } from '../api/mutations';
import { FAB } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react';
import { Colors } from '../theme/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useStore } from '../stores';
import { observer } from 'mobx-react-lite';
import { addReminder, fetchReminders, removeReminder, setReminderCompleted } from '../nativeModules/ReminderModule';
import { ListItemComponent } from '../components/ListItemComponent';
import { useOnForegroundFocus } from '../hooks/useOnForeGroundFocus';

export const ShoppingList = observer(() => {
  const { userStore } = useStore();
  const { showCompletedTasks } = userStore;

  const [data, refetch] = useAuthQuery(GET_LIST);
  const [addToList] = useAuthMutation(ADD_LIST);
  const [setCompleted] = useAuthMutation(COMPLETE_TASK);
  const [deleteTask] = useAuthMutation(DELETE_TASK);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const amountInputRef = useRef<TextInput | null>(null);

  const [list, setList] = useState<ListItem[]>(data?.getList?.list);
  const [orderedList, setOrderedList] = useState<ListItem[]>(data?.getList?.list);
  const [showAddToList, setShowAddToList] = useState(true);
  const [titleInput, setTitleInput] = useState('');
  const [amountInput, setAmountInput] = useState('');

  useEffect(() => {
    if (data?.getList?.list) {
      setList(data.getList.list);
    }
  }, [data?.getList]);

  useOnForegroundFocus(() => {
    if (Platform.OS === 'ios') {
      (async () => {
        setList(await checkList());
      })();
    }
  });

  const add = async () => {
    const reminder = await addReminder(titleInput, amountInput);
    await addToList({
      variables: {
        name: titleInput,
        amount: amountInput,
        id: reminder?.id,
      },
    });

    setShowAddToList(false);
    setTitleInput('');
    setAmountInput('');
    refetch();
  };

  const checkList = async () => {
    await refetch();
    const reminders = await fetchReminders();
    const list = data?.getList?.list;
    let updatedList = data?.getList?.list;

    if (reminders && list) {
      for (const reminder of reminders) {
        const item = list.find((listItem: ListItem) => listItem.id === reminder.id);

        if (item && item.completed !== reminder.completed) {
          const completed = await setCompleted({
            variables: {
              id: item.id,
              completed: reminder.completed,
            },
          });
          if (completed.data.completeTask.list) {
            updatedList = completed.data.completeTask.list;
          }
        } else if (!item) {
          const newList = await addToList({
            variables: {
              name: reminder.title,
              amount: reminder.notes,
              id: reminder.id,
              completed: reminder.completed,
            },
          });
          if (newList.data.addToList.list) {
            updatedList = newList.data.addToList.list;
          }
        }
      }
      for (const item of list) {
        const reminder = reminders.find((reminder) => reminder.id === item.id);
        if (!reminder) await deleteTask({ variables: { id: item.id } });
      }
    }

    return updatedList;
  };

  useEffect(() => {
    if (list) {
      if (showCompletedTasks) {
        const updatedList = [...list].sort((a: ListItem, b: ListItem) =>
          a.completed === b.completed ? 0 : a.completed ? 1 : -1,
        );
        setOrderedList(updatedList);
      } else {
        setOrderedList(list?.filter((item: ListItem) => !item.completed));
      }
    }
  }, [showCompletedTasks, list]);

  return (
    <>
      <ScreenBackground>
        <Header title={i18next.t('shoppingList:title')} />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollContainer}
          onContentSizeChange={() => {
            if (showAddToList) scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          <Pressable style={styles.container} onPress={() => setShowAddToList(!showAddToList)}>
            {orderedList?.map((item: ListItem) => (
              <ListItemComponent
                item={item}
                key={item.id}
                refetch={refetch}
                setCompleted={setCompleted}
                deleteTask={deleteTask}
                setReminderCompleted={setReminderCompleted}
                removeReminder={removeReminder}
              />
            ))}

            {showAddToList && (
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.titleInput}
                  onChangeText={setTitleInput}
                  value={titleInput}
                  placeholder={i18next.t('shoppingList:addTitle')}
                  onSubmitEditing={() => amountInputRef.current?.focus()}
                />
                <TextInput
                  style={styles.amountInput}
                  placeholder={i18next.t('shoppingList:addText')}
                  onChangeText={setAmountInput}
                  value={amountInput}
                  onSubmitEditing={add}
                  ref={amountInputRef}
                />
              </View>
            )}
          </Pressable>
        </ScrollView>
      </ScreenBackground>
      <FAB
        icon={showAddToList ? 'close' : 'plus'}
        color={Colors.textLight}
        style={styles.fab}
        onPress={() => setShowAddToList(!showAddToList)}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    padding: 5,
    paddingHorizontal: 24,
  },
  scrollContainer: {
    width: '100%',
    marginBottom: 30,
    flex: 1,
  },
  addItemContainer: {
    paddingLeft: 50,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.pineOp,
    marginBottom: 30,
  },
  titleInput: {
    fontSize: 16,
    letterSpacing: 0,
    color: Colors.pine,
  },
  amountInput: {
    fontSize: 14,
    letterSpacing: 0,
    color: Colors.pine,
  },
  fab: {
    position: 'absolute',
    margin: 8,
    right: 0,
    top: 75,
    zIndex: 1,
    borderRadius: 30,
  },
});
