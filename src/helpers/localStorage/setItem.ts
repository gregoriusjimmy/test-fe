export const setItem = (key: string, value: string) => {
  return new Promise((resolve) => {
    localStorage.setItem(key, value);
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
