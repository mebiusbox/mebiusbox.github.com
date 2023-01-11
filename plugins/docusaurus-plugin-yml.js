module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-yml',
    configureWebpack(config, isServer, utils) {
      return {
        module: {
          rules: [
            {
              test: /\.(ya?ml)$/,
              loader: "js-yaml-loader"
            },
          ],
        },
      };
    },
  };
};