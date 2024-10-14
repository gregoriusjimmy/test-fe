export const workspaceSlugParam = "workspaceSlug";

// INFO
// Prioritize static routes by defining them before dynamic route parameters.
// The order is important to ensure correct route matching.
export const routePaths = {
  root: {
    root: "/",
    _name: "root",
    dms: {
      root: `/dms`,
      _name: "dms_root",
      _parent: "dms_root",
    },
    requiredAuth: {
      _name: "requiredAuth",
      root: `/required-auth`,
    },
    workspace: {
      root: `/:${workspaceSlugParam}`,
      _name: "workspace_root",
      _parent: "workspace_root",
    },
  },
};
