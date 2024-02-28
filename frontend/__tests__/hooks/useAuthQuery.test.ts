import { renderHook, waitFor } from '@testing-library/react-native';

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
});
