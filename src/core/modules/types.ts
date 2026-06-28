export type ModuleLocalState = Record<string, unknown> & {
  enabledPresets: string[];
};

export type ModuleTemplateRole = 'base' | 'fragment';

export type ModuleTemplateRoles = Record<string, ModuleTemplateRole>;

export type ModuleManifestTemplateConfig = {
  role?: ModuleTemplateRole;
} & Record<string, unknown>;

export type ModuleManifest = {
  templates?: Record<string, ModuleManifestTemplateConfig>;
} & Record<string, unknown>;
