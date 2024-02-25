import i18next from 'i18next';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { List } from 'react-native-paper';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Button } from '../Button';
import { Recipe } from '../../types/recipe';
import { useAuthMutation } from '../../hooks/useAuthMutation';
import { EDIT_RECIPE } from '../../api/mutations';
import { TextInput } from '../TextInput';

type Props = {
  recipeId: string;
  description: string;
};

export const DescriptionComponent: React.FC<Props> = (props) => {
  const [editRecipe, edit_data] = useAuthMutation(EDIT_RECIPE);

  const [openEditDescription, setOpenEditDescription] = useState(false);
  const [description, setDescription] = useState(props.description || '');

  return (
    <View style={styles.listBorder}>
      <List.Accordion
        theme={{ colors: { background: 'transparent', text: Colors.pine } }}
        style={styles.listAccordion}
        title={i18next.t('recipeDetails:description')}
        left={() => <IonIcon name="clipboard-outline" color={Colors.pine} size={24} style={styles.listIcon} />}
        id="1"
        right={() => (
          <MaterialCommunityIcons
            name="lead-pencil"
            color={Colors.pine}
            size={24}
            onPress={() => setOpenEditDescription(true)}
          />
        )}
        expanded={true}
        onLongPress={() => setOpenEditDescription(true)}
        titleStyle={styles.listAccordionTitle}
      >
        <View style={styles.instructionContainer}>
          {openEditDescription ? (
            <>
              <TextInput
                multiline
                scrollEnabled={false}
                onChangeText={setDescription}
                text={description}
                style={{ width: '100%' }}
              />
              <View style={styles.buttonContainer}>
                <Button
                  titleStyle={{ textAlign: 'center', color: Colors.pine }}
                  style={styles.cancelButton}
                  title={i18next.t('recipeDetails:cancel')}
                  onPress={() => setOpenEditDescription(false)}
                />
                <Button
                  titleStyle={{ textAlign: 'center', color: Colors.beige }}
                  style={styles.saveButton}
                  title={i18next.t('recipeDetails:save')}
                  onPress={async () => {
                    await editRecipe({
                      variables: { recipeId: props.recipeId, body: { description } },
                    });
                    // TODO: refetch
                    setOpenEditDescription(false);
                  }}
                />
              </View>
            </>
          ) : (
            <Text style={styles.text}>{description}</Text>
          )}
        </View>
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listBorder: {
    borderWidth: 2,
    borderRadius: 15,
    paddingBottom: 5,
    marginTop: 10,
    borderColor: Colors.grey,
  },
  listIcon: {
    paddingLeft: 12,
    paddingTop: 4,
  },
  listAccordion: {
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    paddingLeft: 20,
    color: Colors.textDark,
    width: '100%',
  },
  instructionContainer: {
    backgroundColor: Colors.beige,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  listAccordionTitle: {
    color: Colors.pine,
    fontSize: 18,
    alignItems: 'center',
  },
  saveButton: {
    borderWidth: 2,
    width: 100,
    backgroundColor: Colors.pine,
    borderColor: Colors.pine,
  },
  cancelButton: {
    borderWidth: 2,
    width: 100,
    borderColor: Colors.pine,
    marginRight: 16,
  },
});
