export const isEmptyObject = (obj: any): boolean => {
  if (obj === null || typeof obj !== "object") {
    return false; // Return false if it's not an object or is null
  }
  return obj && Object.keys(obj).length === 0;
};
