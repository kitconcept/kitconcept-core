import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const frontendRoot = path.resolve(__dirname, '..', '..', '..');
const mrsDeveloperPath = path.join(frontendRoot, 'mrs.developer.json');
const voltoConfigPath = path.join(frontendRoot, 'volto.config.js');

describe('internal configuration checks', () => {
  it('keeps distribution.volto_version aligned with mrs.developer core.tag', async () => {
    const mrsDeveloper = JSON.parse(fs.readFileSync(mrsDeveloperPath, 'utf8'));
    const moduleUrl = pathToFileURL(voltoConfigPath).href;
    const loaded = await import(moduleUrl);
    const config = loaded.default ?? loaded;

    expect(config?.distribution?.volto_version).toBe(mrsDeveloper?.core?.tag);
  });
});
