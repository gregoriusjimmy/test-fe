export const ENV = process.env.REACT_APP_ENV || "development";
export const CHAT_BACKEND_URL = process.env.REACT_APP_CHAT_BACKEND_URL;
export const CHAT_API_URL = CHAT_BACKEND_URL ? `${CHAT_BACKEND_URL}` : "";
export const COOKIES_SECRET = process.env.REACT_APP_COOKIES_SECRET || "";
export const MAIN_URL = process.env.REACT_APP_MAIN_URL || "";
