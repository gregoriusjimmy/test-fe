import Cookies from "js-cookie";

import { deleteCookies } from "./deleteCookies";

import { decrypt } from "helpers/safetor";

import { COOKIES_SECRET } from "config";

export const deleteEncryptedCookies = (key: string, skip = false) => {
  return new Promise((resolve) => {
    if (skip) return resolve(true);

    const cookies = Cookies.get();
    for (const chiperTextKey in cookies) {
      const plainTextKey = decrypt(chiperTextKey, COOKIES_SECRET);
      if (plainTextKey === key) {
        deleteCookies(chiperTextKey);
        break;
      }
    }
    resolve(true);
  });
};
