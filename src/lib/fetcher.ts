import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import camelCase from "lodash.camelcase";
import snakeCase from "lodash.snakecase";

import { EMethod } from "api/index";
import { getCookies, setCookies } from "helpers/cookies";
import { isEmptyObject } from "helpers/isEmptyObject";
import { logout } from "helpers/logout";
import { transformer } from "helpers/transformer";

import { CHAT_API_URL, ENV } from "config";
import { ENDPOINT } from "api/endpoint";
import { ECOOKIES_KEY, EENV, TOKEN_EXPIRED_MESSAGE } from "constants/index";

const _axios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

_axios.interceptors.request.use(
  (config) => {
    const token = getCookies(ECOOKIES_KEY.ACCESS_TOKEN);
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

const getRefreshToken = async (refreshToken: string) => {
  try {
    const { method, url } = ENDPOINT.AUTH.GET_REFRESH_TOKEN;
    const response = await axios({
      method,
      baseURL: CHAT_API_URL,
      url,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        refresh_token: refreshToken,
      },
    });
    // Check if the response contains the tokens
    const { refresh_token: newRefreshToken, access_token: accessToken } =
      response.data.data || {};
    if (!newRefreshToken) {
      throw new Error("Refresh token request was not successful.");
    }
    return {
      refreshToken: newRefreshToken,
      accessToken,
    };
  } catch (err) {
    throw new Error("Unable to get refresh token.");
  }
};

export const refreshToken = async () => {
  const refreshTokenFromCookie = getCookies(ECOOKIES_KEY.REFRESH_AUTH);

  if (!refreshTokenFromCookie) {
    throw new Error("No refresh token");
  }

  const res = await getRefreshToken(refreshTokenFromCookie);
  const { refreshToken, accessToken } = res;
  if (accessToken && refreshToken) {
    setCookies(ECOOKIES_KEY.ACCESS_TOKEN, accessToken);
    setCookies(ECOOKIES_KEY.REFRESH_AUTH, refreshToken);
    return accessToken;
  } else {
    throw new Error("Failed to refresh token.");
  }
};

_axios.interceptors.response.use(
  async (res) => {
    const ignoredKeys =
      (res.config as TFetcherConfig<any, any>).ignoredKeysRes || [];
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

export type TFetcherConfig<T, A> = AxiosRequestConfig<T> & {
  isPublic?: boolean;
  ignoredKeysReq?: string[];
  ignoredKeysRes?: string[];
  urlData?: A;
  isFormData?:boolean
};

export type TFetcherError = {
  message: string;
  code: string;
};

export const fetcher = <TRes, TReq, TParam = unknown>(
  { url, method }: { url: string; method: EMethod },
  {method:configMethod,url:configUrl,data,ignoredKeysReq,urlData,isFormData, headers = {},...config}: TFetcherConfig<TReq, TParam> = {}
): Promise<AxiosResponse<TRes>> => {
  if (ENV === EENV.DEV) {
    console.log("Payload:");
    console.log(transformer(data, snakeCase, ignoredKeysReq));
  }
  const _urlData = urlData as any
  // Replace placeholders in the URL if method is GET and config.data is available
  if (
    [EMethod.GET, EMethod.DELETE, EMethod.PUT].includes(method) &&
    !isEmptyObject(urlData)
  ) {
    // Replace each placeholder in the URL with the corresponding value from config.data
    url = url.replace(/{(.*?)}/g, (match, key) => {
      return key in _urlData!  ? _urlData[key] : match; // Use the value if it exists, else keep the placeholder
    });
  }
  const transformedData = transformer(data, snakeCase, ignoredKeysReq);
  let requestData = transformedData

  if(isFormData){
    const formData = new FormData();
    Object.keys(transformedData).forEach((key) => {
      const value = (transformedData as any)[key];
      if (Array.isArray(value)) {
        // Append each file in array if value is an array (e.g., for multiple files)
        value.forEach((file) => formData.append(key, file));
      } else {
        formData.append(key, value);
      }
    });
    requestData= formData
    headers = {...headers,'Content-Type':'multipart/form-data'}
  }

  return _axios({
    url : url|| configUrl,
    method: method || configMethod,
    data: requestData,
    headers,
    ...config,
  });
};
