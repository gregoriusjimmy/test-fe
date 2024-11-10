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
  GET_TOPIC_MESSAGES: {
    method: EMethod.GET,
    url: "/topics/{topicId}/messages",
  },
};
