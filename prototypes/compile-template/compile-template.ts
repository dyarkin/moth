import YAML from 'yaml';
import nunjucks from 'nunjucks';
import { join } from 'node:path';

const configPath = join(import.meta.dir, 'config.yaml');
const templatePath = join(import.meta.dir, 'mock-template.md');

const configText = await Bun.file(configPath).text();
const config = YAML.parse(configText);

const templateRaw = await Bun.file(templatePath).text();

nunjucks.configure({ autoescape: true });
const result = nunjucks.renderString(templateRaw, config);

console.log(config);
console.log('\n===========================\n');
console.log(result);
