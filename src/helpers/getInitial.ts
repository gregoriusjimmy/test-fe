export const getInitial = (text: string) => {
  const splitedText = text.split(" ");
  const result = `${splitedText[0].charAt(0)}${
    splitedText[1]?.charAt(0) || ""
  }`;
  return result.toUpperCase();
};
