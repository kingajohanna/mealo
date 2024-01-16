import i18next from 'i18next';
import React from 'react';
import { ScrollView } from 'react-native';
import Dialog from 'react-native-dialog';
type Props = {
  isOpen: boolean;
  editValue: string;
  setEditValue: (value: string) => void;
  onCancel: () => void;
  onEdit: () => void;
  folderValues: { [key: string]: boolean };
  handleSwitchChange: (folder: string) => void;
};

export const FolderModal: React.FC<Props> = (props) => {
  return (
    <Dialog.Container visible={props.isOpen}>
      <Dialog.Title>{i18next.t('recipeDetails:addToFolder')}</Dialog.Title>
      <ScrollView style={{ height: 500 }}>
        {Object.keys(props.folderValues).map((folder: string) => (
          <Dialog.Switch
            label={folder}
            value={props.folderValues[folder]}
            onChange={() => props.handleSwitchChange(folder)}
            key={'key' + folder}
          />
        ))}
      </ScrollView>
      <Dialog.Input
        placeholder={i18next.t('recipeDetails:newFolder')}
        onChangeText={(text) => props.setEditValue(text)}
        value={props.editValue}
      />
      <Dialog.Button label={i18next.t('general:cancel')} onPress={props.onCancel} />
      <Dialog.Button label={i18next.t('general:change')} onPress={props.onEdit} />
    </Dialog.Container>
  );
};
