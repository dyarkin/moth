import nunjucks from 'nunjucks';
import { join } from 'node:path';
import { mergeVarSets, readVarSetFromYaml } from '@core/variables';
import { compileTemplate } from '@core/templates';

const mainVarsPath = join(import.meta.dir, 'main.yaml');
const additionalVarsPath = join(import.meta.dir, 'additional.yaml');

const mainVarSet = await readVarSetFromYaml(mainVarsPath);
const additionalVarSet = await readVarSetFromYaml(additionalVarsPath);

const varSet = mergeVarSets({
  main: mainVarSet,
  additional: [additionalVarSet],
});

const templatePath = join(import.meta.dir, 'mock-template.md');
const templateRaw = await Bun.file(templatePath).text();

nunjucks.configure({
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
  noCache: true,
});
const result = compileTemplate({ templateText: templateRaw, varSet });

console.log(varSet);
console.log('\n===========================\n');
console.log(result);
