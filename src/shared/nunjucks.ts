import type { ConfigureOptions } from 'nunjucks';

export const DEFAULT_NUNJUCKS_ENV_OPTIONS: ConfigureOptions = {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
  noCache: true,
};
