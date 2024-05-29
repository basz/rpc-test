import settle from './settle';

describe('settle function tests', () => {
  test('should return result property on promise fulfillment', async () => {
    const expectedValue = 'success';
    const promise = Promise.resolve(expectedValue);

    const { result, error } = await settle(promise);

    expect(result).toBe(expectedValue);
    expect(error).toBeUndefined();
  });

  test('should return error property on promise rejection', async () => {
    const expectedError = new Error('failure');
    const promise = Promise.reject(expectedError);

    const { result, error } = await settle(promise);

    expect(error).toEqual(expectedError);
    expect(result).toBeUndefined;
  });

  test('should handle asynchronous operations correctly', async () => {
    const asyncOperation = (value, shouldReject = false) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldReject) {
            reject(new Error('Async error'));
          } else {
            resolve(value);
          }
        }, 1);
      });
    };

    {
      const successPromise = asyncOperation('async success');
      const { result, error } = await settle(successPromise);

      expect(result).toBe('async success');
    }

    {
      const failurePromise = asyncOperation(null, true);
      const { result, error } = await settle(failurePromise);

      expect(error).toEqual(new Error('Async error'));
      expect(result).toBeUndefined();
    }
  });
});
