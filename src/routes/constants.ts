export const topicSlugParam = "topicSlug";

// INFO
// Prioritize static routes by defining them before dynamic route parameters.
// The order is important to ensure correct route matching.
export const routePaths = {
  root: {
    root: "/",
    _name: "root",
    login: {
      root: `/login`,
      _name: "login_root",
      _parent: "login_root",
    },
    topic: {
      root: `/:${topicSlugParam}`,
      _name: "topic_root",
      _parent: "topic_root",
    },
  },
};
