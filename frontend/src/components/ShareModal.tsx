import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ShareMenuReactView } from 'react-native-share-menu';
import Dialog from 'react-native-dialog';

const Share = () => {
  const [sharedData, setSharedData] = useState('');

  useEffect(() => {
    ShareMenuReactView.data().then(({ data }) => {
      setSharedData(data);
    });
  }, []);

  return (
    <View>
      <Dialog.Container visible={true}>
        <Dialog.Title>Add recipe</Dialog.Title>
        <Dialog.Description>Do you want to add this recipe to your collection?</Dialog.Description>
        <Dialog.Button
          label="Dismiss"
          onPress={() => {
            ShareMenuReactView.dismissExtension();
          }}
        />
        <Dialog.Button
          label="Add"
          onPress={() => {
            ShareMenuReactView.continueInApp({ sharedData });
          }}
        />
      </Dialog.Container>
    </View>
  );
};

export default Share;
