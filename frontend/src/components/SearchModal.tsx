import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Time } from '../screens/Recipes';
import { Button } from 'react-native-paper';
import { GET_RECIPES } from '../api/queries';
import { useAuthQuery } from '../hooks/useAuthQuery';
import { TextInput } from './TextInput';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import i18next from 'i18next';
import { isAndroid } from '../utils/androidHelper';

interface SearchModalProps {
  refRBSheet: React.MutableRefObject<any>;
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
  const [data] = useAuthQuery(GET_RECIPES);
  const [categories, setCategories] = React.useState<string[]>([i18next.t(`recipes:all`)]);
  const [cuisines, setCuisines] = React.useState<string[]>([i18next.t(`recipes:all`)]);

  useEffect(() => {
    if (data?.getRecipes.categories) {
      setCategories([i18next.t(`recipes:all`), ...data?.getRecipes.categories]);
    }
    if (data?.getRecipes.cuisines) {
      setCuisines([i18next.t(`recipes:all`), ...data?.getRecipes.cuisines]);
    }
  }, [data]);

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
        style={{ backgroundColor, ...styles.icon }}
        onPress={() => {
          setTime(isActive ? undefined : timeType);
        }}
      />
    );
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={() => refRBSheet.current?.close()}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={refRBSheet}
      index={0}
      snapPoints={[isAndroid ? '30%' : '55%']}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <TextInput onChangeText={onChangeText} text={text} placeholder={i18next.t(`recipes:searchModalTitle`)} />
      <View style={styles.timeContainer}>
        {renderTimeIcon(Time.fast)}
        {renderTimeIcon(Time.moderate)}
        {renderTimeIcon(Time.slow)}
      </View>
      <View style={styles.rowContainer}>
        <Picker style={styles.halfWidth} selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
          {categories.map((cat: string | undefined, index: any) => (
            <Picker.Item label={cat} value={cat} key={`category${index}`} />
          ))}
        </Picker>

        <Picker style={styles.halfWidth} selectedValue={cuisine} onValueChange={(itemValue) => setCuisine(itemValue)}>
          {cuisines.map((cui: string | undefined, index: any) => (
            <Picker.Item label={cui} value={cui} key={`cuisine${index}`} />
          ))}
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} textColor={Colors.textLight} onPress={reset}>
          {i18next.t(`recipes:reset`)}
        </Button>
        <Button style={styles.button} textColor={Colors.textLight} onPress={search}>
          {i18next.t(`recipes:search`)}
        </Button>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: Colors.beige,
    borderTopColor: Colors.salmon,
    borderTopWidth: 3,
  },
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
