export enum EMethod {
  "POST" = "POST",
  "GET" = "GET",
}

export type TCommonApiRes<T = any> = {
  status: number;
  message: string;
  data: T;
};
