import { act, renderHook } from '@testing-library/react-native';

import { useAuthQuery } from '../../src/hooks/useAuthQuery';
import { useQuery } from '@apollo/client';
import { GET_LIST } from '../../src/api/queries';

jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
  gql: jest.fn().mockImplementation((query) => query),
}));

describe('useAuthQuery', () => {
  it('returns data when query is successful', async () => {
    const mockData = { data: 'mockData' };
    (useQuery as jest.Mock).mockReturnValue({
      refetch: jest.fn(),
      error: null,
      data: mockData,
      loading: false,
      client: {},
    });

    const { result } = renderHook(() => useAuthQuery(GET_LIST));
    expect(result.current[0]).toEqual(mockData);
  });

  it('retries query when there is an error', async () => {
    const mockError = new Error('mockError');
    const refetch = jest.fn();
    (useQuery as jest.Mock)
      .mockReturnValueOnce({
        refetch,
        error: mockError,
        data: null,
        loading: false,
        client: {},
      })
      .mockReturnValueOnce({
        refetch,
        error: null,
        data: null,
        loading: false,
        client: {},
      });

    const { result } = renderHook(() => useAuthQuery(GET_LIST));

    await act(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    });

    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
