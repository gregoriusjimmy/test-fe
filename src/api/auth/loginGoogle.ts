import { fetcher } from "lib/fetcher";

import { TLoginGoogleReq, TLoginGoogleRes } from "./types";
import { ENDPOINT } from "../endpoint";

export const loginGoogle = async (payload: TLoginGoogleReq) => {
  return await fetcher<TLoginGoogleRes, TLoginGoogleReq>(
    ENDPOINT.AUTH.LOGIN_GOOGLE,
    {
      data: payload,
    }
  );
};
