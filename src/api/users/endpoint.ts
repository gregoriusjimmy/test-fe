import { EMethod } from "..";

export const USERS_ENDPOINT = {
  GET_USER: {
    method: EMethod.GET,
    url: "/users/{id}",
  },
  GET_USER_TOPICS: {
    method: EMethod.GET,
    url: "/users/{id}/topics",
  },
};
