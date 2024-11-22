import { TCommonApiRes } from "..";

export type TGetAIModelsRes = TCommonApiRes<TAIModel[]>;

export type TAIModel = {
  id: EAIModelId;
  companyName: string;
  modelName: string;
  model: string;
  apiKey: string;
  active: boolean;
};

export enum EAIModelId {
  CHATGPT40 = 1,
  "CLAUDE3.5SONNET" = 2,
}
