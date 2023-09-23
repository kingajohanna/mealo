import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from '../../navigation/tabs';
import { Header } from '../../components/Header';
import { Colors } from '../../theme/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { CheckableText } from '../../components/CheckableText';
import { AddRecipeProps } from '../AddRecipe';
import { BottomButtons } from '../../components/BottomButtons';

export const ChooseSteps: React.FC<AddRecipeProps> = (props) => {
  const [selected, setSelected] = useState<string[]>([]);

  const splitted = props.text.split('\n');

  const addStep = (text: string, checked: boolean) => {
    const updated = checked ? [...selected, text] : selected.filter((t) => t !== text);

    setSelected(updated);
  };

  return (
    <>
      <Header title={Tabs.ADD_INSTRUCTIONS} />
      <View style={styles.container}>
        <ScrollView style={{ marginTop: 16 }}>
          {splitted.map((text, index) => (
            <CheckableText
              key={index}
              checkedStyle={{ backgroundColor: Colors.salmon }}
              addChecked={(checked: boolean) => addStep(text, checked)}
            >
              {text}
            </CheckableText>
          ))}
        </ScrollView>
      </View>
      <BottomButtons
        back={props.back}
        next={() => {
          props.setRecipe({ ...props.recipe, instructions: selected });
          props.next();
        }}
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
