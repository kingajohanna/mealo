import { DocumentNode, useMutation } from '@apollo/client';

export const useAuthMutation = (mutation: DocumentNode, refetchQueries?: DocumentNode[]) => {
  const [runMutation, { data, loading, error, client }] = useMutation(mutation, {
    refetchQueries,
  });

  return [runMutation, data, client, error, loading];
};
