import { DocumentNode, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

const MAXTRY = 5;

export const useAuthMutation = (mutation: DocumentNode) => {
  const [runMutation, { data, loading, error, client }] = useMutation(mutation);
  const [tryCount, setTryCount] = useState(0);

  useEffect(() => {
    if (error && tryCount < MAXTRY) {
      console.log(error);
      setTryCount(tryCount + 1);
    }
  }, [data, loading, error]);

  return [runMutation, data, client, error, loading];
};
