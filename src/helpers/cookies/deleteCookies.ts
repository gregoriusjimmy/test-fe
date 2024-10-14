import Cookies from "js-cookie";

import { ENV, MAIN_URL } from "config";
import { EENV } from "constants/index";

export const deleteCookies = (key: string) => {
  const { hostname } = new URL(MAIN_URL);
  Cookies.remove(key, {
    domain: ENV === EENV.DEV ? undefined : `.${hostname}`,
  });
};
