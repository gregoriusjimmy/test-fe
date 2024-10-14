export const truncate = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text; // Return original text if it's shorter than the max length
  }

  return text.slice(0, maxLength - 3) + "..."; // Truncate and add ellipsis
};
