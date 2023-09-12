import React from 'react';
import {View, TextInput, StyleSheet, Dimensions} from 'react-native';
import {useStore} from '../stores';
import {Colors} from '../theme/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Picker} from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Time} from '../screens/Recipes';
import {Button} from 'react-native-paper';
import {observer} from 'mobx-react-lite';

const {height} = Dimensions.get('window');

interface SearchModalProps {
  refRBSheet: React.MutableRefObject<RBSheet>;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
  time: Time | undefined;
  setTime: React.Dispatch<React.SetStateAction<Time | undefined>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  cuisine: string;
  setCuisine: React.Dispatch<React.SetStateAction<string>>;
  reset: () => void;
  search: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = observer(
  ({
    refRBSheet,
    onChangeText,
    text,
    time,
    setTime,
    category,
    setCategory,
    cuisine,
    setCuisine,
    reset,
    search,
  }) => {
    const {recipeStore} = useStore();
    const {categories, cuisines} = recipeStore;

    const getColor = (rule: boolean) => {
      return rule ? Colors.green : Colors.pine;
    };

    const renderTimeIcon = (timeType: Time) => {
      const isActive = time === timeType;
      const backgroundColor = isActive ? Colors.pine : Colors.green;

      const getIconName = (timeType: Time) => {
        switch (timeType) {
          case Time.fast:
            return 'speedometer';
          case Time.moderate:
            return 'speedometer-medium';
          default:
            return 'speedometer-slow';
        }
      };

      return (
        <MaterialCommunityIcons
          name={getIconName(timeType)}
          color={getColor(isActive)}
          size={50}
          style={{backgroundColor, ...styles.icon}}
          onPress={() => {
            setTime(isActive ? undefined : timeType);
          }}
        />
      );
    };

    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        height={height * 0.7}
        customStyles={{
          wrapper: styles.wrapper,
          draggableIcon: styles.draggableIcon,
          container: styles.container,
        }}>
        <TextInput
          style={styles.titleText}
          placeholderTextColor={Colors.textDark}
          onChangeText={onChangeText}
          value={text}
          placeholder="Search recipes"
        />
        <View style={styles.timeContainer}>
          {renderTimeIcon(Time.fast)}
          {renderTimeIcon(Time.moderate)}
          {renderTimeIcon(Time.slow)}
        </View>
        <View style={styles.rowContainer}>
          {categories && (
            <Picker
              style={styles.halfWidth}
              selectedValue={category}
              onValueChange={itemValue => setCategory(itemValue)}>
              {categories.map((cat, index) => (
                <Picker.Item label={cat} value={cat} key={`category${index}`} />
              ))}
            </Picker>
          )}
          {cuisines && (
            <Picker
              style={styles.halfWidth}
              selectedValue={cuisine}
              onValueChange={itemValue => setCuisine(itemValue)}>
              {cuisines.map((cui, index) => (
                <Picker.Item label={cui} value={cui} key={`cuisine${index}`} />
              ))}
            </Picker>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            textColor={Colors.textLight}
            onPress={reset}>
            Reset
          </Button>
          <Button
            style={styles.button}
            textColor={Colors.textLight}
            onPress={search}>
            Search
          </Button>
        </View>
      </RBSheet>
    );
  },
);

const styles = StyleSheet.create({
  icon: {
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 6,
    borderColor: Colors.pine,
    overflow: 'hidden',
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    width: '47%',
    backgroundColor: Colors.pine,
  },
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  draggableIcon: {
    backgroundColor: '#000',
  },
  container: {
    borderColor: Colors.salmon,
    borderTopWidth: 3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    paddingBottom: 5,
    flex: 1,
    backgroundColor: Colors.beige,
  },
  titleText: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 8,
    borderColor: Colors.pine,
    backgroundColor: Colors.beige,
  },
  timeContainer: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  halfWidth: {
    width: '50%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
  },
  rowContainer: {
    flexDirection: 'row',
  },
});
