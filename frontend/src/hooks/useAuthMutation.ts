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

export const useAuthMutation = (mutation: DocumentNode, variables?: any) => {
  const [runMutation, {data, loading, error, client}] = useMutation(mutation);

  useEffect(() => {
    if (error) {
      auth()
        .currentUser?.getIdToken(true)
        .then(token => {
          storage.set('token', token);
        });
    }
  }, [data, loading, error]);

  return [runMutation, data, client, error, loading];
};
