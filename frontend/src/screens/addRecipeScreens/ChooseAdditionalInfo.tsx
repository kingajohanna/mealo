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
import { Picker } from '@react-native-picker/picker';
import { Button } from '../../components/Button';
import * as ImagePicker from 'react-native-image-picker';
import { ReactNativeFile } from 'apollo-upload-client';
import { GET_RECIPES } from '../../api/queries';
import { useAuthQuery } from '../../hooks/useAuthQuery';

const SPEED = ['fast', 'moderate', 'slow'];

export const ChooseAdditionalInfo: React.FC<AddRecipeProps> = (props) => {
  const [addOcrRecipe] = useAuthMutation(ADD_OCR_RECIPE);
  const [data, refetch] = useAuthQuery(GET_RECIPES);
  const navigation = useNavigation();

  const [prepTime, setPreptime] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const [yields, setYields] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [speed, setSpeed] = useState(SPEED[0]);
  const [image, setImage] = useState('');

  const chooseFromGallery = async () => {
    const image = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (image.assets) {
      setImage(image.assets[0].uri!);
    }
  };

  const generateTextInput = (
    onChangeText: (text: string) => void,
    text: string,
    placeholder: string,
    disabled?: boolean,
  ) => {
    return (
      <TextInput
        onChangeText={onChangeText}
        text={text}
        placeholder={placeholder}
        style={styles.textInput}
        disabled={disabled}
      />
    );
  };

  return (
    <>
      <Header title={Tabs.ADD_TITLE} />
      <ScrollView>
        <View style={styles.container}>
          {generateTextInput(setPreptime, prepTime, 'Prep time')}
          {generateTextInput(setTotalTime, totalTime, 'Total time')}
          {generateTextInput(setYields, yields, 'Yields')}
          {generateTextInput(setCuisine, cuisine, 'Cuisine', false)}
          <Button
            onPress={chooseFromGallery}
            title={image ? 'recipe.jpg' : 'Choose image from gallery'}
            style={{ backgroundColor: image ? Colors.pine : Colors.salmon, marginBottom: 16, marginTop: 0 }}
            titleStyle={{ textAlign: 'center' }}
          />

          <View style={styles.speedBox}>
            <Text style={{ color: Colors.pine }}>Speed</Text>
            <Picker style={styles.halfWidth} selectedValue={speed} onValueChange={(itemValue) => setSpeed(itemValue)}>
              {SPEED.map((speed: string, index: number) => (
                <Picker.Item label={speed} value={speed} key={`speed${index}`} />
              ))}
            </Picker>
          </View>

          <Text>{props.text}</Text>
        </View>
      </ScrollView>
      <BottomButtons
        back={props.back}
        next={async () => {
          const getImage = () => {
            if (image === '') return {};
            return {
              image: new ReactNativeFile({
                uri: image,
                name: `test.jpg`,
                type: 'image/jpeg',
              }),
            };
          };

          await addOcrRecipe({
            variables: { recipe: { ...props.recipe, prepTime, totalTime, yields, cuisine, speed }, ...getImage() },
          });

          await refetch();

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
  textInput: {
    width: '80%',
    marginBottom: 16,
  },
  halfWidth: {
    width: '50%',
  },
  speedBox: {
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 8,
    borderColor: Colors.pine,
    backgroundColor: Colors.beige,
  },
});

/*
const file = new ReactNativeFile({
            uri: 'file:///Users/kingaszabo/Library/Developer/CoreSimulator/Devices/95E82CE7-345F-4973-9D0C-719461854FEC/data/Containers/Data/Application/80915F6F-663B-4350-B452-98B9DAD16FF7/tmp/ECE92ED8-F32B-41B6-9A2E-1AFEB84B024B.png',
            name: `test.jpg`,
            type: 'image/jpeg',
          });

          await addOcrRecipe({
            variables: { recipe: { ...props.recipe }, image: file },
          });
          */
