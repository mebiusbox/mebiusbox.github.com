const path = require("path");
module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-katex-client',
    getClientModules() {
      return [path.resolve(__dirname, "./render")];
    },
  };
};