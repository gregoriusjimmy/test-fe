export enum EMethod {
  "POST" = "POST",
  "GET" = "GET",
  "DELETE" = "DELETE",
  "PUT" = "PUT",
}

export type TCommonApiRes<T = any> = {
  message: string;
  data: T;
};

export type TUrlDataReq<T = any> = {
  _urlData: T;
};

export type TCommonMutationParam<T, A = unknown> = {
  payload: T;
  urlData: A;
};
