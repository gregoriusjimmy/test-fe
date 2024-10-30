import { TCommonApiRes } from "..";

export type TGetAIModelsRes = TCommonApiRes<TAIModel[]>;

export type TAIModel = {
  id: number;
  companyName: string;
  modelName: string;
  model: string;
  apiKey: string;
  active: boolean;
};
