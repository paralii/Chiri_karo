export const pick = <T extends object, K extends keyof T>(
  source: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (source[key] !== undefined) {
      result[key] = source[key];
    }
  });
  return result;
};
