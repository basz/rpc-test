export type ResultObject<T> = { result?: T; error?: any };

const settle = <T>(promise: Promise<T>): Promise<ResultObject<T>> => {
  return Promise.allSettled([promise]).then(([settledResult]) => {
    if (settledResult.status === 'fulfilled') {
      return { result: settledResult.value };
    } else {
      return { error: settledResult.reason };
    }
  });
};

export default settle;
