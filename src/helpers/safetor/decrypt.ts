import CryptoJS from "crypto-js";

export const decrypt = (cipherText: string, secretKey: string) => {
  if (!cipherText) return "";
  let plainText = "";

  try {
    plainText = CryptoJS.AES.decrypt(cipherText, secretKey).toString(
      CryptoJS.enc.Utf8
    );
  } catch (err) {
    console.error(err, cipherText);
  }

  return plainText;
};
