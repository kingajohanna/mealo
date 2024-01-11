import { DocumentNode, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const MAXTRY = 5;

export const useAuthQuery = (query: DocumentNode) => {
  const { refetch, error, data, loading, client } = useQuery(query);
  const [tryCount, setTryCount] = useState(0);

  useEffect(() => {
    if (error && tryCount < MAXTRY) {
      console.log(error);
      setTryCount(tryCount + 1);
    }
  }, [data, loading, error, refetch]);

  return [data, refetch, client, error, loading];
};
