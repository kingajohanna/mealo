import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput, ToggleButton } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import i18next from 'i18next';
import { Recipe } from '../../types/recipe';
import { useStore } from '../../stores';
import { PDFDocument, PDFImage } from 'pdf-lib';
import * as fontkit from '@pdf-lib/fontkit';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { fontBase64, pdfBase64 } from '../../assets/form';

type Props = {
  recipe: Recipe;
  setOpenShareModal: (value: boolean) => void;
  setRecipe: (recipe: Recipe) => void;
};

export const OtherActionContainer: React.FC<Props> = ({ recipe, setOpenShareModal, setRecipe }) => {
  const { userStore } = useStore();
  const [yields, setYields] = useState(recipe.yields || '1 serving');

  const sendPdf = async () => {
    userStore.setLoading(true);
    const pdfDoc = await PDFDocument.load(pdfBase64);

    pdfDoc.registerFontkit(fontkit);
    const custom = await pdfDoc.embedFont(fontBase64);

    const form = pdfDoc.getForm();

    const title = form.getTextField('title');
    const time = form.getTextField('time');
    const yields = form.getTextField('yields');
    const ingredients = form.getTextField('ingredients');
    const instructions = form.getTextField('instructions');
    const ingredientsTitle = form.getTextField('ingredientsTitle');
    const instructionsTitle = form.getTextField('instructionsTitle');
    const image = form.getButton('image');

    title.setText(recipe.title);

    time.setText(recipe.totalTime || '');
    yields.setText(recipe.yields || '');
    ingredientsTitle.setText(i18next.t('recipeDetails:ingredients'));

    instructionsTitle.setText(i18next.t('recipeDetails:instructions'));

    ingredients.setText(recipe.ingredients.map((ingredient) => `- ${ingredient}`).join('\n'));
    instructions.setText(
      recipe.instructions.map((instruction: string, index: number) => `  ${index + 1}.   ${instruction}`).join('\n') ||
        recipe.description,
    );

    const imgBase64 = (await ReactNativeBlobUtil.fetch('GET', recipe.image)).base64() as string;
    let pdfImage: PDFImage;
    if (recipe.image.includes('png')) pdfImage = await pdfDoc.embedJpg(imgBase64);
    else pdfImage = await pdfDoc.embedJpg(imgBase64);
    image.setImage(pdfImage);

    form.updateFieldAppearances(custom);
    form.flatten();

    const uri = await pdfDoc.saveAsBase64({ dataUri: true });
    console.log(uri);
    userStore.setLoading(false);

    Share.open({ type: 'application/pdf', url: uri, filename: recipe.title + '.pdf' })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  const increaseServings = () => {
    const firstWord = yields.split(' ')[0];
    if (/^\d+$/.test(firstWord)) {
      const newServings = parseFloat(firstWord) + 1;

      const ratio = newServings / parseFloat(firstWord);

      setYields(`${newServings} servings`);

      const newIngredients = recipe.ingredients.map((ingredient: string) => {
        const firstWord = ingredient.split(' ')[0];
        if (/^\d+(\.\d+)?$/.test(firstWord)) {
          const newAmount = Math.round(parseFloat(firstWord) * ratio * 100) / 100;
          return newAmount.toString() + ' ' + ingredient.split(' ')?.slice(1, undefined)?.join(' ');
        }
        return ingredient;
      });

      setRecipe({ ...recipe, ingredients: newIngredients });
    }
  };

  const decreaseServings = () => {
    const firstWord = yields.split(' ')[0];
    if (/^\d+$/.test(firstWord)) {
      if (parseFloat(firstWord) === 1) return;

      const newServings = parseFloat(firstWord) - 1;

      const ratio = newServings / parseFloat(firstWord);

      setYields(`${newServings} servings`);

      const newIngredients = recipe.ingredients.map((ingredient: string) => {
        const firstWord = ingredient.split(' ')[0];
        if (/^\d+(\.\d+)?$/.test(firstWord)) {
          const newAmount = Math.round(parseFloat(firstWord) * ratio * 100) / 100;

          return newAmount.toString() + ' ' + ingredient.split(' ')?.slice(1, undefined)?.join(' ');
        }
        return ingredient;
      });

      setRecipe({ ...recipe, ingredients: newIngredients });
    }
  };

  return (
    <>
      <View style={styles.siteDataContainer}>
        <Pressable style={styles.rowContainer} onPress={async () => await sendPdf()}>
          <IonIcon name="print" color={Colors.pine} size={28} />
          <Text style={styles.siteText}>{i18next.t('recipeDetails:print')}</Text>
        </Pressable>
        <Pressable style={styles.rowContainer} onPress={() => setOpenShareModal(true)}>
          <IonIcon name={Platform.OS === 'android' ? 'share-social' : 'share-outline'} color={Colors.pine} size={28} />
          <Text style={styles.siteText}>{i18next.t('recipeDetails:share')}</Text>
        </Pressable>
        <View style={styles.rowContainer}>
          <MaterialCommunityIcons name="web" color={Colors.pine} size={28} />
          <Text style={styles.siteText}>{recipe.siteName}</Text>
        </View>
      </View>
      <View style={styles.servingContainer}>
        <ToggleButton.Row onValueChange={() => {}} value={''}>
          <ToggleButton
            icon="minus"
            value="accept"
            onPress={() => {
              decreaseServings();
            }}
            iconColor={Colors.salmon}
            rippleColor={Colors.salmonOp}
            style={styles.toggleButtonStyle}
          />
          <TextInput label={yields} disabled mode="outlined" style={{ backgroundColor: Colors.beige }} />
          <ToggleButton
            icon="plus"
            value="cancel"
            onPress={() => {
              increaseServings();
            }}
            iconColor={Colors.salmon}
            rippleColor={Colors.salmonOp}
            style={styles.toggleButtonStyle}
          />
        </ToggleButton.Row>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  siteDataContainer: {
    paddingLeft: 12,
    paddingTop: 24,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  siteText: {
    paddingLeft: 12,
    fontSize: 16,
    color: Colors.pine,
  },
  servingContainer: {
    alignSelf: 'center',
  },
  toggleButtonStyle: {
    height: 50,
    marginTop: 6,
    marginLeft: -1,
    backgroundColor: Colors.salmonOp,
  },
});
