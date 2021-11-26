import camelCase from 'lodash/camelCase';

const requireModules = require.context(
  '.', false, /\.js$/,
);
const modules = {};

requireModules.keys().forEach((fileName) => {
  if (fileName === './index.js' || fileName === './dummy.js') {
    return;
  }

  const moduleConfig = requireModules(fileName);
  const moduleName = camelCase(fileName.replace(/\.\/|\.js/g, ''));
  modules[moduleName] = moduleConfig.default || moduleConfig;
});

export default modules;
