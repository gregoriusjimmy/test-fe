import { EMethod } from "..";

export const TOPICS_ENDPOINT = {
  DELETE_TOPIC: {
    method: EMethod.DELETE,
    url: "/topics/{id}",
  },
  UPDATE_TOPIC: {
    method: EMethod.PUT,
    url: "/topics/{id}",
  },
};
