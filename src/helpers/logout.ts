import { clearCookies } from "./cookies";

import { db } from "services/indexedDB";

import { ENV } from "config";
import { EENV } from "constants/index";
import { routePaths } from "routes/constants";

export const logout = async () => {
  setTimeout(async () => {
    try {
      await db.delete();
    } catch (err) {
      console.error("Error deleting IndexedDB:", err);
    }
    localStorage.clear();
    // let redirectUrl = `${LOGIN_URL}/logout`;
    if (ENV === EENV.DEV) {
      clearCookies();
      // redirectUrl = `${MAIN_URL}/bypass-auth`;
    }

    window.location.replace(routePaths.root.login.root);
  }, 500);
};
