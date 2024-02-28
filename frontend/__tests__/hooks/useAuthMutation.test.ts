import { renderHook, act } from '@testing-library/react-native';
import { REMOVE_MEAL } from '../../src/api/mutations';
import { useAuthMutation } from '../../src/hooks/useAuthMutation';

describe('useAuthMutation', () => {
  it('should handle successful mutation', async () => {
    const mockMutationFn = jest.fn().mockResolvedValue({ data: 'mockData' });
    jest
      .spyOn(require('@apollo/client'), 'useMutation')
      .mockImplementation(() => [mockMutationFn, { data: 'mockData', loading: false, error: null, client: {} }]);

    const { result } = renderHook(() => useAuthMutation(REMOVE_MEAL));

    await act(async () => {
      await result.current[0]();
    });

    expect(mockMutationFn).toHaveBeenCalled();
    expect(result.current[1]).toBe('mockData');
    expect(result.current[3]).toBe(null);
    expect(result.current[4]).toBe(false);
  });
});
