import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import camelCase from "lodash.camelcase";
import startCase from "lodash.startcase";

import { getCookies } from "helpers/cookies";
import { logout } from "helpers/logout";
import { transformer } from "helpers/transformer";

import { CHAT_API_URL, ENV } from "config";
import { ECOOKIES_KEY, EENV, TOKEN_EXPIRED_MESSAGE } from "constants/index";

const _axios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

_axios.interceptors.request.use(
  (config) => {
    const token = getCookies(ECOOKIES_KEY.AUTH);
    if (token) {
      config.headers["Authorization"] = token;
    }
    if (!config.baseURL) {
      config.baseURL = CHAT_API_URL;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getRefreshToken = async (refreshToken: string, email: string) => {
  // try {
  //   const { method, url } = ENDPOINT.USER.GET_REFRESH_TOKEN;
  //   const response = await axios({
  //     method,
  //     baseURL: CHAT_API_URL,
  //     url,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: {
  //       Email: email,
  //       RefreshToken: refreshToken,
  //     },
  //   });
  //   // Check if the response contains the tokens
  //   const {
  //     IdToken: idToken,
  //     RefreshToken: newRefreshToken,
  //     AccessToken: accessToken,
  //   } = response.data || {};
  //   if (!idToken || !newRefreshToken) {
  //     throw new Error("Refresh token request was not successful.");
  //   }
  //   return {
  //     idToken,
  //     refreshToken: newRefreshToken,
  //     accessToken,
  //   };
  // } catch (err) {
  //   throw new Error("Unable to get refresh token.");
  // }
};

export const refreshToken = async () => {
  const email = getCookies(ECOOKIES_KEY.EMAIL);
  const refreshTokenFromCookie = getCookies(ECOOKIES_KEY.REFRESH_AUTH);

  if (!refreshTokenFromCookie || !email) {
    throw new Error("No refresh token or email found.");
  }

  const res = await getRefreshToken(refreshTokenFromCookie, email);
  // const { idToken, refreshToken, accessToken } = res;
  // if (idToken && refreshToken) {
  //   setCookies(ECOOKIES_KEY.ACCESS_TOKEN, accessToken);
  //   setCookies(ECOOKIES_KEY.AUTH, idToken);
  //   setCookies(ECOOKIES_KEY.REFRESH_AUTH, refreshToken);
  //   return accessToken;
  // } else {
  //   throw new Error("Failed to refresh token.");
  // }
};

_axios.interceptors.response.use(
  async (res) => {
    const ignoredKeys =
      (res.config as TFetcherConfig<any>).ignoredKeysRes || [];
    if (ENV === EENV.DEV) {
      console.log("Response:");
      console.log(transformer(res.data, camelCase, ignoredKeys));
    }
    if (res.data) {
      res.data = transformer(res.data, camelCase, ignoredKeys);
    }
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      // Response unauthorized
      if (err.response.status === 401) {
        if (
          err.response.data?.message === TOKEN_EXPIRED_MESSAGE &&
          !originalConfig._retry
        ) {
          // Access token was expired
          originalConfig._retry = true;
          try {
            const newAccessToken = await refreshToken();
            originalConfig.headers["Authorization"] = newAccessToken;
            return _axios(originalConfig);
          } catch (_error) {
            return logout();
          }
        } else if (err.response.data?.message === "Permission denied") {
          return Promise.reject({
            message:
              err?.response?.data?.message ||
              err?.message ||
              "Unexpected error",
            code: err?.code,
          });
        } else {
          return logout();
        }
      } else {
        return Promise.reject({
          message:
            err?.response?.data?.message || err?.message || "Unexpected error",
          code: err?.code,
          data: err?.response?.data,
        });
      }
    }

    return Promise.reject(err);
  }
);

export type TFetcherConfig<T> = AxiosRequestConfig<T> & {
  isPublic?: boolean;
  ignoredKeysReq?: string[];
  ignoredKeysRes?: string[];
};

export type TFetcherError = {
  message: string;
  code: string;
};

export const fetcher = <TRes, TReq>(
  { url, method }: { url: string; method: string },
  config: TFetcherConfig<TReq> = {}
): Promise<AxiosResponse<TRes>> => {
  if (ENV === EENV.DEV) {
    console.log("Payload:");
    console.log(transformer(config.data, startCase, config.ignoredKeysReq));
  }
  return _axios({
    url,
    method,
    data: transformer(config.data, startCase, config.ignoredKeysReq),
    ...config,
  });
};
