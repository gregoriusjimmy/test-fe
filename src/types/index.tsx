export type LanguageType = "id" | "en";

export type RouteType = {
  path: string;
  element: React.ReactNode;
  requiredAuth?: boolean;
  withoutLayout?: boolean;
};
