import { fetcher } from "lib/fetcher";

import { TLogoutReq, TLogoutRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const logout = async () => {
  return await fetcher<TLogoutRes, TLogoutReq>(ENDPOINT.AUTH.LOGOUT);
};
