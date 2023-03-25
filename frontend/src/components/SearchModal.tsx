import React from 'react';
import {View, TextInput, StyleSheet, Dimensions} from 'react-native';
import {useStore} from '../stores';
import {Colors} from '../theme/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Picker} from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Time} from '../screens/Recipes';
import {Button} from 'react-native-paper';

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

const {height} = Dimensions.get('window');

export const SearchModal: React.FC<SearchModalProps> = ({
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

  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={false}
      closeOnPressMask={true}
      height={height * 0.7}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        draggableIcon: {
          backgroundColor: '#000',
        },
        container: {
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          padding: 20,
          paddingBottom: 5,
          flex: 1,
        },
      }}>
      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          marginHorizontal: 8,
          borderColor: Colors.teal,
        }}
        onChangeText={onChangeText}
        value={text}
        placeholder="Search recipes"
      />
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20,
        }}>
        <MaterialCommunityIcons
          name="speedometer-slow"
          color={time === Time.fast ? Colors.gainsboro : Colors.teal}
          size={50}
          style={{
            ...{
              backgroundColor:
                time === Time.fast ? Colors.teal : Colors.gainsboro,
            },
            ...styles.icon,
          }}
          onPress={() => {
            time === Time.fast ? setTime(undefined) : setTime(Time.fast);
          }}
        />
        <MaterialCommunityIcons
          name="speedometer-medium"
          color={time === Time.moderate ? Colors.gainsboro : Colors.teal}
          size={50}
          style={{
            ...{
              backgroundColor:
                time === Time.moderate ? Colors.teal : Colors.gainsboro,
            },
            ...styles.icon,
          }}
          onPress={() => {
            time === Time.moderate
              ? setTime(undefined)
              : setTime(Time.moderate);
          }}
        />
        <MaterialCommunityIcons
          name="speedometer"
          color={time === Time.slow ? Colors.gainsboro : Colors.teal}
          size={50}
          style={{
            ...{
              backgroundColor:
                time === Time.slow ? Colors.teal : Colors.gainsboro,
            },
            ...styles.icon,
          }}
          onPress={() => {
            time === Time.slow ? setTime(undefined) : setTime(Time.slow);
          }}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        {categories && (
          <Picker
            style={{width: '50%'}}
            selectedValue={category}
            onValueChange={itemValue => setCategory(itemValue)}>
            {categories.map((cat, index) => (
              <Picker.Item label={cat} value={cat} key={'category' + index} />
            ))}
          </Picker>
        )}
        {cuisines && (
          <Picker
            style={{width: '50%'}}
            selectedValue={cuisine}
            onValueChange={itemValue => setCuisine(itemValue)}>
            {cuisines.map((cui, index) => (
              <Picker.Item label={cui} value={cui} key={'cuisine' + index} />
            ))}
          </Picker>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 8,
        }}>
        <Button
          style={styles.button}
          textColor={Colors.gainsboro}
          onPress={reset}>
          Reset
        </Button>
        <Button
          style={styles.button}
          textColor={Colors.gainsboro}
          onPress={search}>
          Search
        </Button>
      </View>
    </RBSheet>
  );
};

const styles = StyleSheet.create({
  icon: {
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 6,
    borderColor: Colors.teal,
    overflow: 'hidden',
  },
  button: {
    borderWidth: 1,
    borderRadius: 10,
    width: 120,
    backgroundColor: Colors.teal,
  },
});
