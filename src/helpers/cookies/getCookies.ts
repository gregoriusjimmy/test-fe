import Cookies from "js-cookie";

import { decrypt } from "helpers/safetor";

import { COOKIES_SECRET } from "config";

export const getCookies = (cookiesKey: string) => {
  const cookiesObj = Cookies.get();
  for (const key in cookiesObj) {
    const plainTextKey = decrypt(key, COOKIES_SECRET);
    if (plainTextKey === cookiesKey) {
      const plainTextValue = decrypt(cookiesObj[key], COOKIES_SECRET);
      return plainTextValue;
    }
  }

  return "";
};
