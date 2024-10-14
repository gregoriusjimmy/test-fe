export const getItem = (key: string) => {
  const data = localStorage.getItem(key);
  return data;
};
