import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Checkbox, List } from 'react-native-paper';
import { ListItem } from '../types/list';
import { Colors } from '../theme/colors';
import { useRef } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  item: ListItem;
  refetch: () => void;
  setCompleted: Function;
  deleteTask: Function;
  setReminderCompleted: Function;
  removeReminder: Function;
};

export const ListItemComponent: React.FC<Props> = ({
  item,
  refetch,
  setCompleted,
  deleteTask,
  setReminderCompleted,
  removeReminder,
}) => {
  const swipeableRef = useRef<Swipeable | null>(null);

  const close = () => {
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const renderRightAction = (dragX: {
    interpolate: (arg0: { inputRange: number[]; outputRange: number[] }) => any;
  }) => {
    const trans = dragX.interpolate({
      inputRange: [0, 0, 52, 54],
      outputRange: [0, 0, 0, 0],
    });

    const deleteHandler = async () => {
      try {
        close();

        await deleteTask({ variables: { id: item.id } });
        await removeReminder(item.id);
        await refetch();
      } catch (error: any) {
        console.error('Error removing meal:', error.message);
      }
    };

    return (
      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateX: trans }],
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}
      >
        <Pressable style={{ ...styles.swipeableButton, backgroundColor: Colors.red }} onPress={deleteHandler}>
          <MaterialIcons name="delete" color={Colors.textLight} size={24} />
        </Pressable>
      </Animated.View>
    );
  };

  const renderRightActions = (progress: {
    interpolate: (arg0: { inputRange: number[]; outputRange: number[] }) => any;
  }) => <View style={styles.rightActionsContainer}>{renderRightAction(progress)}</View>;

  const complete = async (id: string, completed: boolean) => {
    await setCompleted({
      variables: {
        id,
        completed: completed ? false : true,
      },
    });
    await setReminderCompleted(id, completed ? 0 : 1);
  };

  return (
    <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
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
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  checkboxIos: {
    borderRadius: 24,
    borderColor: Colors.pine,
    borderWidth: 1,
  },
  swipeableButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '80%',
    borderRadius: 5,
  },
  rightActionsContainer: {
    width: 100,
    flexDirection: 'row',
  },
});
