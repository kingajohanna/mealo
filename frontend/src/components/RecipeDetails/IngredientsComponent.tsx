import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import i18next from 'i18next';
import { List } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { CheckableText } from '../CheckableText';

type Props = {
  ingredients: string[];
};

export const IngredientsComponent: React.FC<Props> = ({ ingredients }) => {
  const [openIngredients, setOpenIngredients] = useState(true);
  return (
    <View style={styles.listBorder}>
      <List.Accordion
        theme={{ colors: { background: 'transparent', text: Colors.pine } }}
        style={styles.listAccordion}
        title={i18next.t('recipeDetails:ingredients')}
        left={() => <MaterialCommunityIcons name="chef-hat" color={Colors.pine} size={24} style={styles.listIcon} />}
        id="2"
        expanded={openIngredients}
        onPress={() => setOpenIngredients(!openIngredients)}
        titleStyle={styles.listAccordionTitle}
      >
        <View style={styles.ingredientsContainer}>
          {ingredients.map((ingredient: string, index: number) => {
            return (
              <CheckableText checkedStyle={styles.checkedText} key={'ingredient' + index} style={styles.text}>
                <Text style={styles.text}>• </Text>
                <Text style={styles.text}>{ingredient}</Text>
              </CheckableText>
            );
          })}
        </View>
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  listAccordion: {
    backgroundColor: 'transparent',
  },
  listAccordionTitle: {
    color: Colors.pine,
    fontSize: 18,
    alignItems: 'center',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  listIcon: {
    paddingLeft: 12,
    paddingTop: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: 20,
    color: Colors.textDark,
    width: '100%',
  },
  ingredientsContainer: {
    backgroundColor: Colors.beige,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingStart: 16,
    borderTopWidth: 2,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    borderTopColor: Colors.grey,
  },
  listBorder: {
    borderWidth: 2,
    borderRadius: 15,
    paddingBottom: 5,
    marginTop: 10,
    borderColor: Colors.grey,
  },
});
