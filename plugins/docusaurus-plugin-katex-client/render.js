import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default (function () {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  return {
    onRouteUpdate({ location }) {
      // console.log(`onRouteUpdate: ${location.pathname}`);
    },
    onRouteDidUpdate({ location }) {
      // console.log(`onRouteDidUpdate: ${location.pathname}`);

      const pathIsIncluded = 
        location.pathname.startsWith("/docs/note") ||
        location.pathname.startsWith("/blog");
      // console.log(`onRouteDidUpdate: pathIsIncluded = ${pathIsIncluded}`);
      if (pathIsIncluded == false) {
        
        return null;
      }

      renderMathInElement(document.body, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\(', right: '\\)', display: false},
            {left: '\\[', right: '\\]', display: true}
        ],
        throwOnError : false,
        strict: false
      });
    },
  };
})();