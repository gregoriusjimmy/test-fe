import { EMethod } from "..";

export const AUTH_ENDPOINT = {
  GET_REFRESH_TOKEN: {
    method: EMethod.POST,
    url: "/auth/refresh",
  },
  LOGIN_GOOGLE: {
    method: EMethod.POST,
    url: "/auth/login-google",
  },
  LOGOUT: {
    method: EMethod.POST,
    url: "/auth/logout",
  },
};
