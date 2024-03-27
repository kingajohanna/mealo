import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Header } from '../../components/Header';
import { Colors } from '../../theme/colors';
import * as ImagePicker from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { Button } from '../../components/Button';
import LottieView from 'lottie-react-native';
import { Modal, Portal } from 'react-native-paper';
import { AddRecipeProps } from '../AddRecipe';
import { BottomButtons } from '../../components/BottomButtons';
import { useAuthMutation } from '../../hooks/useAuthMutation';
import { BING_ANALYZER } from '../../api/mutations';
import i18next from 'i18next';

export const ReadOCR: React.FC<AddRecipeProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [bingAnalyze, data] = useAuthMutation(BING_ANALYZER);

  useEffect(() => {
    props.setText(data?.bingAnalyzer);
    setLoading(false);
  }, [data]);

  const chooseFromGallery = async () => {
    const image = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });
    if (image.assets) {
      setLoading(true);
      const result = await TextRecognition.recognize(image.assets[0].uri!);

      console.log(result.text);

      await bingAnalyze({ variables: { text: result.text } });
    }
  };

  return (
    <>
      <Portal>
        <Modal visible={loading}>
          <LottieView
            style={{
              height: 400,
            }}
            ref={null}
            source={require('../../assets/anim/loading.json')}
            loop
            autoPlay
          />
        </Modal>
      </Portal>

      <Header title={i18next.t('addRecipe:title')} />
      <View style={styles.container}>
        <Button
          onPress={chooseFromGallery}
          title="Choose from gallery"
          style={{ backgroundColor: Colors.salmon }}
          titleStyle={{ textAlign: 'center' }}
        />

        <TextInput
          multiline
          style={styles.textInput}
          onChangeText={(text: string) => props.setText(text)}
          placeholder="Or paste the recipe here"
        >
          {props.text}
        </TextInput>
      </View>
      <BottomButtons
        back={props.back}
        disabled={props.text === undefined}
        next={() => {
          props.setRecipe({ ...props.recipe }), props.next();
        }}
        backTitle="Cancel"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    padding: 16,
    overflow: 'scroll',
  },
});
