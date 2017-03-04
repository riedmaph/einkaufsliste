export interface Parser<T> {
  parse: (_: string) => T;
}
