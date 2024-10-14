import CryptoJS from "crypto-js";

export const encrypt = (plainText: string, secretKey: string) => {
  if (!plainText) return "";
  let cipherText = "";

  try {
    cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString();
  } catch (err) {
    console.error(err, plainText);
  }

  return cipherText;
};
