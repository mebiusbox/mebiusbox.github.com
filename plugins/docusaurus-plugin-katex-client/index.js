import path from "path";
export default function (context, options) {
  return {
    name: 'docusaurus-plugin-katex-client',
    getClientModules() {
      return [path.resolve(__dirname, "./render")];
    },
  };
};