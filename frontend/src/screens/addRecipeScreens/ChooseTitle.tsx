import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Header } from '../../components/Header';
import { Colors } from '../../theme/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { CheckableText } from '../../components/CheckableText';
import { AddRecipeProps } from '../AddRecipe';
import { TextInput } from '../../components/TextInput';
import { BottomButtons } from '../../components/BottomButtons';
import i18next from 'i18next';

export const ChooseTitle: React.FC<AddRecipeProps> = (props) => {
  const [selected, setSelected] = useState<[number, string][]>([]);
  const [title, setTitle] = useState('');

  const splitted = props.text.split('\n');

  const orderTitle = (text: string, index: number, checked: boolean) => {
    const itemToFind: [number, string] = [index, text];

    const updatedSelected = checked
      ? [...selected, itemToFind]
      : selected.filter(([i, t]) => !(i === index && t === text));

    const sortedArray = updatedSelected.sort((a, b) => a[0] - b[0]);

    setSelected(sortedArray);
    setTitle(sortedArray.map((item) => item[1]).join(' '));
  };

  return (
    <>
      <Header title={i18next.t('addRecipe:chooseTitle')} />
      <View style={styles.container}>
        <TextInput onChangeText={setTitle} text={title} placeholder="Title" style={{ width: '80%' }} />
        <ScrollView style={{ marginTop: 16 }}>
          {splitted.map((item, index) => (
            <Text key={index}>
              {item.split(' ').map((word, index) => (
                <CheckableText
                  key={index}
                  checkedStyle={{ backgroundColor: Colors.salmon }}
                  addChecked={(checked: boolean) => orderTitle(word, index, checked)}
                >
                  {word + ' '}
                </CheckableText>
              ))}
            </Text>
          ))}
        </ScrollView>
      </View>
      <BottomButtons
        back={props.back}
        next={() => {
          props.setRecipe({ ...props.recipe, title }), props.next();
        }}
        disabled={title.length === 0}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});
