const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const frontendRoot = path.join(repoRoot, 'frontend');
const repositoryTomlPath = path.join(repoRoot, 'repository.toml');
const voltoConfigPath = path.join(frontendRoot, 'volto.config.js');
const mrsDeveloperPath = path.join(frontendRoot, 'mrs.developer.json');

function readRepositorySettings() {
  const toml = fs.readFileSync(repositoryTomlPath, 'utf8');
  let section = '';
  const settings = {};

  toml.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) return;
    const sectionMatch = line.match(/^\[(.+)\]$/);
    if (sectionMatch) {
      section = sectionMatch[1];
      return;
    }
    if (section !== 'frontend.package') return;
    const kvMatch = line.match(/^([a-zA-Z0-9_]+)\s*=\s*"([^"]*)"$/);
    if (!kvMatch) return;
    const [, key, value] = kvMatch;
    settings[key] = value;
  });

  if (!settings.base_package || !settings.path) {
    throw new Error(
      'Missing frontend.package.base_package or frontend.package.path in repository.toml',
    );
  }

  return settings;
}

function readDistributionVersion(packageJsonPath, distributionName) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const sections = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ];
  for (const section of sections) {
    const value = pkg[section]?.[distributionName];
    if (value) return value;
  }
  return null;
}

function readInstalledDistributionPackage(distributionName) {
  let packageJsonPath = '';
  try {
    packageJsonPath = require.resolve(
      path.join(distributionName, 'package.json'),
      { paths: [frontendRoot] },
    );
  } catch (error) {
    throw new Error(
      `Unable to resolve ${distributionName} package.json from ${frontendRoot}. Run pnpm install first.`,
    );
  }

  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}

function fetchDistributionVoltoVersion(distributionName, distributionVersion) {
  const cmd = `pnpm view ${distributionName}@${distributionVersion} volto_version --json`;
  const stdout = execSync(cmd, { cwd: frontendRoot, stdio: 'pipe' }).toString();
  if (!stdout.trim()) return null;
  try {
    return JSON.parse(stdout);
  } catch (error) {
    return stdout.trim().replace(/^"|"$/g, '');
  }
}

function fetchDistributionDependencies(distributionName, distributionVersion) {
  const cmd = `pnpm view ${distributionName}@${distributionVersion} dependencies --json`;
  const stdout = execSync(cmd, { cwd: frontendRoot, stdio: 'pipe' }).toString();
  const deps = stdout.trim() ? JSON.parse(stdout) : {};
  return deps || {};
}

function readExistingVoltoConfig() {
  if (!fs.existsSync(voltoConfigPath)) {
    return {};
  }
  // eslint-disable-next-line import/no-dynamic-require
  return require(voltoConfigPath);
}

function writeVoltoConfig({ addons = [], theme = '', distribution = null }) {
  const content = [
    `const addons = ${JSON.stringify(addons, null, 2)};`,
    `const theme = ${JSON.stringify(theme, null, 2)};`,
    `const distribution = ${JSON.stringify(distribution, null, 2)};`,
    '',
    'module.exports = {',
    '  addons,',
    '  theme,',
    '  distribution,',
    '};',
    '',
  ].join('\n');

  fs.writeFileSync(voltoConfigPath, content, 'utf8');
}

function updateMrsDeveloper(voltoVersion) {
  if (!fs.existsSync(mrsDeveloperPath)) {
    throw new Error(`Missing ${mrsDeveloperPath}`);
  }
  const data = JSON.parse(fs.readFileSync(mrsDeveloperPath, 'utf8'));
  if (!data.core) {
    data.core = {};
  }
  data.core.tag = voltoVersion || '';
  fs.writeFileSync(
    mrsDeveloperPath,
    `${JSON.stringify(data, null, 2)}\n`,
    'utf8',
  );
}

async function main() {
  const settings = readRepositorySettings();
  const distributionName = settings.base_package;
  const addonPath = path.join(repoRoot, settings.path, 'package.json');

  const distributionVersion = readDistributionVersion(
    addonPath,
    distributionName,
  );
  if (!distributionVersion) {
    throw new Error(
      `Distribution ${distributionName} not found in ${addonPath}`,
    );
  }

  const dependencies = fetchDistributionDependencies(
    distributionName,
    distributionVersion,
  );
  let voltoVersion = fetchDistributionVoltoVersion(
    distributionName,
    distributionVersion,
  );
  if (!voltoVersion) {
    const distributionPkg = readInstalledDistributionPackage(distributionName);
    voltoVersion = distributionPkg.volto_version || null;
  }

  const existing = readExistingVoltoConfig();
  const addons = existing.addons || [];
  const theme = existing.theme || '';
  const distribution = {
    name: distributionName,
    version: distributionVersion,
    volto_version: voltoVersion,
    dependencies,
  };

  writeVoltoConfig({
    addons,
    theme,
    distribution,
  });

  updateMrsDeveloper(voltoVersion);

  // eslint-disable-next-line no-console
  console.log(
    `Updated volto.config.js with ${distributionName}@${distributionVersion} dependencies.`,
  );
}

main();
