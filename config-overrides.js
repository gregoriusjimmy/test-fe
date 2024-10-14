const path = require("path");

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      components: path.resolve(__dirname, "src/components"),
      constants: path.resolve(__dirname, "src/constants"),
      context: path.resolve(__dirname, "src/context"),
      store: path.resolve(__dirname, "src/store"),
      helpers: path.resolve(__dirname, "src/helpers"),
      hooks: path.resolve(__dirname, "src/hooks"),
      lib: path.resolve(__dirname, "src/lib"),
      modules: path.resolve(__dirname, "src/modules"),
      services: path.resolve(__dirname, "src/services"),
      pages: path.resolve(__dirname, "src/pages"),
      routes: path.resolve(__dirname, "src/routes"),
      style: path.resolve(__dirname, "src/style"),
      types: path.resolve(__dirname, "src/types"),
      api: path.resolve(__dirname, "src/api"),
      "@type": path.resolve(__dirname, "src"),
      "@ui": path.resolve(__dirname, "src"),
      "@constant": path.resolve(__dirname, "src"),
    },
  };
  return config;
};
