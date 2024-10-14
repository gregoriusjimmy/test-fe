export const transformer = (
  object: any,
  transformerFn: (string?: string) => string,
  ignoredKeys: string[] = []
): any => {
  if (!object) return object;

  if (Array.isArray(object)) {
    return object.map((r) => transformer(r, transformerFn, ignoredKeys));
  }

  if (typeof object === "object") {
    const res: { [key: string]: any } = {};
    for (const key in object) {
      const ignoreKey = ignoredKeys.includes(key);
      const prop = key.startsWith("__") || ignoreKey ? key : transformerFn(key);
      res[prop] = ignoreKey
        ? object[key]
        : transformer(object[key], transformerFn, ignoredKeys);
    }
    return res;
  }

  return object;
};
