import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

import {ShareMenuReactView} from 'react-native-share-menu';
import Dialog from 'react-native-dialog';

const height = Dimensions.get('window').height;

const Share = () => {
  const [sharedData, setSharedData] = useState('');

  useEffect(() => {
    ShareMenuReactView.data().then(({data}) => {
      setSharedData(data);
    });
  }, []);

  return (
    <View>
      <Dialog.Container visible={true}>
        <Dialog.Title>Add recipe</Dialog.Title>
        <Dialog.Description>
          Do you want to add this recipe to your collection?
        </Dialog.Description>
        <Dialog.Button
          label="Dismiss"
          onPress={() => {
            ShareMenuReactView.dismissExtension();
          }}
        />
        <Dialog.Button
          label="Add"
          onPress={() => {
            ShareMenuReactView.continueInApp({sharedData});
          }}
        />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: height / 3,
    width: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destructive: {
    color: 'red',
  },
  send: {
    color: 'blue',
  },
  sending: {
    color: 'grey',
  },
  image: {
    width: '100%',
    height: 200,
  },
  buttonGroup: {
    alignItems: 'center',
  },
});

export default Share;
