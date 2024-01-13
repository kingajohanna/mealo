import * as React from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ScreenBackground } from '../components/Background';
import { Header } from '../components/Header';
import { GET_LIST } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import i18next from 'i18next';
import { useAuthMutation } from '../hooks/useAuthMutation';
import { ListItem } from '../types/list';
import { ADD_LIST, COMPLETE_TASK } from '../api/mutations';
import { Checkbox, List } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react';
import { Colors } from '../theme/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useStore } from '../stores';
import { observer } from 'mobx-react-lite';

export const ShoppingList = observer(() => {
  const { userStore } = useStore();
  const { showCompletedTasks } = userStore;

  const [data, refetch] = useAuthQuery(GET_LIST);
  const [addToList] = useAuthMutation(ADD_LIST);
  const [setCompleted] = useAuthMutation(COMPLETE_TASK);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const amountInputRef = useRef<TextInput | null>(null);

  const [orderedList, setOrderedList] = useState<ListItem[]>(data?.getList?.list);
  const [showAddToList, setShowAddToList] = useState(true);
  const [titleInput, setTitleInput] = useState('');
  const [amountInput, setAmountInput] = useState('');

  const add = async () => {
    await addToList({
      variables: {
        name: titleInput,
        amount: amountInput,
      },
    });
    setShowAddToList(false);
    setTitleInput('');
    setAmountInput('');
    refetch();
  };

  const complete = async (id: string, completed: boolean) => {
    await setCompleted({
      variables: {
        id,
        currentCompleted: completed,
      },
    });
    refetch();
  };

  useEffect(() => {
    if (data?.getList?.list) {
      if (showCompletedTasks) {
        const temp: ListItem[] = [...data?.getList?.list];

        temp.sort(function (x: ListItem, y: ListItem) {
          return x.completed === y.completed ? 0 : x.completed ? 1 : -1;
        });
        setOrderedList(temp);
      } else {
        setOrderedList(data?.getList?.list.filter((item: ListItem) => !item.completed));
      }
    }
  }, [data?.getList?.list, showCompletedTasks]);

  return (
    <ScreenBackground>
      <Header title={i18next.t('shoppingList:title')} />
      <Pressable style={styles.container} onPress={() => setShowAddToList(!showAddToList)}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollContainer}
          onContentSizeChange={() => {
            if (showAddToList) scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {orderedList?.map((item: ListItem) => (
            <List.Item
              key={item.id}
              title={item.name}
              description={item.amount}
              left={() => (
                <>
                  {Platform.OS === 'ios' ? (
                    <View style={styles.checkboxIos}>
                      <Checkbox
                        status={item.completed ? 'checked' : 'unchecked'}
                        onPress={() => complete(item.id, item.completed)}
                      />
                    </View>
                  ) : (
                    <Checkbox
                      status={item.completed ? 'checked' : 'unchecked'}
                      onPress={() => complete(item.id, item.completed)}
                    />
                  )}
                </>
              )}
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
        </ScrollView>
      </Pressable>
    </ScreenBackground>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    height: '100%',
    padding: 5,
    paddingHorizontal: 24,
    marginBottom: 30,
    width: '100%',
  },
  scrollContainer: {
    width: '100%',
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
  checkboxIos: {
    borderRadius: 24,
    borderColor: Colors.pine,
    borderWidth: 1,
  },
});
