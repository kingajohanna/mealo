import {
  DocumentNode,
  useApolloClient,
  useMutation,
  useQuery,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {useEffect, useState} from 'react';
import {GET_RECIPES} from '../api/queries';
import auth from '@react-native-firebase/auth';
import {storage} from '../stores/localStorage';

const MAXTRY = 5;

export const useAuthMutation = (mutation: DocumentNode, variables?: any) => {
  const [runMutation, {data, loading, error, client}] = useMutation(mutation);
  const [tryCount, setTryCount] = useState(0);

  useEffect(() => {
    if (error && tryCount < MAXTRY) {
      console.log(error);
      setTryCount(tryCount + 1);

      auth()
        .currentUser?.getIdToken(true)
        .then(token => {
          storage.set('token', token);
        });
    }
  }, [data, loading, error]);

  return [runMutation, data, client, error, loading];
};
