import i18next from 'i18next';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { List } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';

type Props = {
  instructions: string[];
};

export const InstructionsComponent: React.FC<Props> = ({ instructions }) => {
  const [openInstructions, setOpenInstructions] = useState(true);

  return (
    <View style={styles.listBorder}>
      <List.Accordion
        theme={{ colors: { background: 'transparent', text: Colors.pine } }}
        style={styles.listAccordion}
        title={i18next.t('recipeDetails:instructions')}
        left={() => <MaterialCommunityIcons name="knife" color={Colors.pine} size={24} style={styles.listIcon} />}
        id="3"
        expanded={openInstructions}
        onPress={() => setOpenInstructions(!openInstructions)}
        titleStyle={styles.listAccordionTitle}
      >
        <View style={styles.ingredientsContainer}>
          {instructions.map((instruction: string, index: number) => {
            return (
              <View key={instruction + index} style={{ paddingRight: 8 }}>
                <Text style={styles.textMedium}>
                  {index + 1} {i18next.t('recipeDetails:step')}{' '}
                </Text>
                <View style={styles.ingredientsListContainer}>
                  <View style={styles.verticalLine} />
                  <Text style={styles.text} key={'instruction' + index}>
                    {instruction}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  listBorder: {
    borderWidth: 2,
    borderRadius: 15,
    paddingBottom: 5,
    marginTop: 10,
    borderColor: Colors.grey,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: 20,
    color: Colors.textDark,
    width: '100%',
  },
  verticalLine: {
    height: '95%',
    width: 3,
    backgroundColor: Colors.grey,
  },
  ingredientsListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  textMedium: {
    fontSize: 18,
    lineHeight: 24,
  },
  listIcon: {
    paddingLeft: 12,
    paddingTop: 4,
  },
  listAccordion: {
    backgroundColor: 'transparent',
  },
  listAccordionTitle: {
    color: Colors.pine,
    fontSize: 18,
    alignItems: 'center',
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
});
