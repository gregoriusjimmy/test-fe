import Cookies from "js-cookie";

import { deleteEncryptedCookies } from "./deleteEncryptedCookies";

import { encrypt } from "helpers/safetor";

import { COOKIES_SECRET, ENV, MAIN_URL } from "config";
import { EENV } from "constants/index";

export const setCookies = (key: string, value: string, clearFirst = true) => {
  deleteEncryptedCookies(key, !clearFirst).then(() => {
    const { hostname } = new URL(MAIN_URL);
    const chiperTextKey = encrypt(key, COOKIES_SECRET);
    const chiperTextValue = encrypt(value, COOKIES_SECRET);

    Cookies.set(chiperTextKey, chiperTextValue, {
      domain: ENV === EENV.DEV ? undefined : `.${hostname}`,
      expires: 30, //days
    });
  });
};
