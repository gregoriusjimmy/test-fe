import { TCommonApiRes } from "..";

import { TUser } from "api/users/types";

export type TGetRefreshTokenReq = {
  refresh_token: string;
};

export type TGetRefreshTokenRes = TCommonApiRes<{
  accessToken: string;
  refreshToken: string;
}>;

export type TLoginGoogleReq = {
  token: string;
};

export type TLoginGoogleRes = TCommonApiRes<{
  user: TUser;
  accessToken: string;
  refreshToken: string;
}>;

export type TLogoutReq = any;

export type TLogoutRes = TCommonApiRes<null>;
