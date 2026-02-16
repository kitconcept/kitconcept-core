const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'volto.config.js');

const catalogPath = path.resolve(__dirname, 'core/catalog.json');
let catalog = {};
if (fs.existsSync(catalogPath)) {
  const catalogData = fs.readFileSync(catalogPath, 'utf-8');
  catalog = JSON.parse(catalogData);
} else {
  console.error('Catalog file does not exist at:', catalogPath);
}

function getEnforcedDependencies() {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const config = require(configPath);
    if (config?.distribution?.dependencies)
      return config.distribution.dependencies;
  } catch (error) {
    return {};
  }
  return {};
}

const enforced = getEnforcedDependencies();
const enforcedKeys = Object.keys(enforced || {});

function applyOverrides(section) {
  if (!section || enforcedKeys.length === 0) return;
  for (const name of enforcedKeys) {
    if (section[name]) {
      section[name] = enforced[name];
    }
  }
}

module.exports = {
  hooks: {
    // Ensure that the distribution dependencies from volto.config.js are always used,
    //  overriding any other versions specified in package.json files.
    readPackage(pkg) {
      applyOverrides(pkg.dependencies);
      applyOverrides(pkg.devDependencies);
      applyOverrides(pkg.optionalDependencies);
      applyOverrides(pkg.peerDependencies);
      return pkg;
    },
    // Ensure that the default catalog is set in the configuration, if not already specified.
    updateConfig(config) {
      if (config.catalogs) {
        config.catalogs.default ??= catalog;
      }
      return config;
    },
  },
};
