// Build-time placeholder. The build step replaces it with a string literal.
// If it is not replaced, it stays undefined.
declare const __MOTH_VERSION__: string | undefined;

// `typeof` keeps this safe when the placeholder is not defined at runtime.
const buildTimeVersion =
  typeof __MOTH_VERSION__ === 'undefined' ? undefined : __MOTH_VERSION__;

export const MOTH_VERSION = buildTimeVersion ?? 'dev';
