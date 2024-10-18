export enum EMethod {
  "POST" = "POST",
  "GET" = "GET",
}

export type TCommonApiRes<T = any> = {
  message: string;
  data: T;
};
