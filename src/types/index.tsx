export type LanguageType = "id" | "en";

export type RouteType = {
  path: string;
  element: React.ReactNode;
  requiredAuth?: boolean;
  withoutLayout?: boolean;
};

export interface CustomCSSProperties extends React.CSSProperties {
  "--pulse-duration"?: string;
}
