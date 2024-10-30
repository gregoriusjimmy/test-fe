import { AI_MODELS_ENDPOINT } from "./ai-models/endpoint";
import { AUTH_ENDPOINT } from "./auth/endpoint";
import { TOPICS_ENDPOINT } from "./topics/endpoint";
import { USERS_ENDPOINT } from "./users/endpoint";

export const ENDPOINT = {
  AUTH: AUTH_ENDPOINT,
  USERS: USERS_ENDPOINT,
  TOPICS: TOPICS_ENDPOINT,
  AI_MODELS: AI_MODELS_ENDPOINT,
};
