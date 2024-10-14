export const replaceParamFromRoute = ({
  route,
  param,
  value,
  queries = {},
}: {
  route: string;
  param: string | string[];
  value: string | string[];
  queries?: Record<string, string | number | boolean>;
}) => {
  let url = route;
  if (Array.isArray(param) && Array.isArray(value)) {
    for (let i = 0; i < param.length; i++) {
      url = url.replace(`:${param[i]}`, value[i]);
    }
  } else if (Array.isArray(param) || Array.isArray(value)) {
    throw new Error("Parameter is not correct");
  } else {
    url = url.replace(`:${param}`, value);
  }

  const newUrl = new URL(url, window.location.origin);

  Object.entries(queries).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      newUrl.searchParams.append(key, String(val));
    }
  });

  return `${newUrl.pathname}${newUrl.search}`;
};
