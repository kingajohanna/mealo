import {DocumentNode, useApolloClient, useQuery} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {useEffect, useState} from 'react';
import {GET_RECIPES} from '../api/queries';
import auth from '@react-native-firebase/auth';
import {storage} from '../stores/localStorage';

export const useAuthQuery = (query: DocumentNode, variables?: any) => {
  const {refetch, error, data, loading, client} = useQuery(query);

  useEffect(() => {
    if (error) {
      auth()
        .currentUser?.getIdToken(true)
        .then(token => {
          storage.set('token', token);
          refetch();
        });
    }
  }, [data, loading, error, refetch]);

  return [refetch, data, client, error, loading];
};
