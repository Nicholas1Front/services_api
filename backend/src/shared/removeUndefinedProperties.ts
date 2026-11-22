type WithoutUndefined<T> = {
  [K in keyof T]: Exclude<T[K], undefined>;
};

export const removeUndefinedProperties = <T extends Record<string, unknown>>(
  data: T,
): Partial<WithoutUndefined<T>> =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<WithoutUndefined<T>>;
