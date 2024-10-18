import { fetcher } from "lib/fetcher";

import { TGetRefreshTokenReq, TGetRefreshTokenRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const getRefreshToken = async () => {
  return await fetcher<TGetRefreshTokenRes, TGetRefreshTokenReq>(
    ENDPOINT.AUTH.GET_REFRESH_TOKEN
  );
};
