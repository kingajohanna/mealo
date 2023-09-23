import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from '../../navigation/tabs';
import { Header } from '../../components/Header';
import { Colors } from '../../theme/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { AddRecipeProps } from '../AddRecipe';
import { TextInput } from '../../components/TextInput';
import { BottomButtons } from '../../components/BottomButtons';
import { useAuthMutation } from '../../hooks/useAuthMutation';
import { ADD_OCR_RECIPE } from '../../api/mutations';
import { useNavigation } from '@react-navigation/native';

export const ChooseTime: React.FC<AddRecipeProps> = (props) => {
  const [addOcrRecipe] = useAuthMutation(ADD_OCR_RECIPE);
  const navigation = useNavigation();

  const [prepTime, setPreptime] = useState('');
  const [totalTime, setTotalTime] = useState('');

  return (
    <>
      <Header title={Tabs.ADD_TITLE} />
      <View style={styles.container}>
        <TextInput onChangeText={setPreptime} text={prepTime} placeholder="Prep time" style={{ width: '80%' }} />
        <TextInput
          onChangeText={setTotalTime}
          text={totalTime}
          placeholder="Total time"
          style={{ width: '80%', marginTop: 16 }}
        />
        <ScrollView style={{ marginTop: 16 }}>
          <Text>{props.text}</Text>
        </ScrollView>
      </View>
      <BottomButtons
        back={props.back}
        next={async () => {
          await addOcrRecipe({
            variables: { recipe: { ...props.recipe, prepTime, totalTime } },
          });
          navigation.getParent()?.goBack();
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
