import { DocumentNode, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { storage } from '../stores/localStorage';

const MAXTRY = 5;

export const useAuthMutation = (mutation: DocumentNode) => {
  const [runMutation, { data, loading, error, client }] = useMutation(mutation);
  const [tryCount, setTryCount] = useState(0);

  useEffect(() => {
    if (error && tryCount < MAXTRY) {
      console.log(error);
      setTryCount(tryCount + 1);

      auth()
        .currentUser?.getIdToken(true)
        .then((token) => {
          storage.set('token', token);
        });
    }
  }, [data, loading, error]);

  return [runMutation, data, client, error, loading];
};
