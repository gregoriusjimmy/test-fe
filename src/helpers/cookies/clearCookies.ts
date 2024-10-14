import Cookies from "js-cookie";

import { deleteCookies } from "./deleteCookies";

export const clearCookies = () => {
  Object.keys(Cookies.get()).forEach(function (cookieName) {
    deleteCookies(cookieName);
  });
};
