import i18next from 'i18next';
import React from 'react';
import Dialog from 'react-native-dialog';

type Props = {
  isOpen: boolean;
  editValue: string;
  setEditValue: (value: string) => void;
  onCancel: () => void;
  onShare: () => void;
};

export const ShareModal: React.FC<Props> = (props) => {
  return (
    <Dialog.Container visible={props.isOpen}>
      <Dialog.Title>{i18next.t('recipeDetails:share')}</Dialog.Title>
      <Dialog.Input
        placeholder={i18next.t('recipeDetails:shareModalPlaceholder')}
        value={props.editValue}
        onChangeText={(text) => props.setEditValue(text)}
      />
      <Dialog.Button label={i18next.t('general:cancel')} onPress={props.onCancel} />
      <Dialog.Button label={i18next.t('recipeDetails:share')} onPress={props.onShare} />
    </Dialog.Container>
  );
};
