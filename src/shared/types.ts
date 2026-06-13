export type OpaqueString<Brand extends string> = string & {
  readonly __brand: Brand;
};
