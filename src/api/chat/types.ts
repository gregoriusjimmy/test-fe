import { TCommonApiRes } from "..";

export type TGetWorkspacesReq = any;

export type TGetWorkspacesRes = TCommonApiRes<TWorkspace[]>;

export type TWorkspace = {
  id: string;
  idEntity: string;
  entityType: string;
  name: string;
  uniqueId: string;
  description: string;
  imageProfile: string;
  createdAt: string;
  updatedAt: string;
};
