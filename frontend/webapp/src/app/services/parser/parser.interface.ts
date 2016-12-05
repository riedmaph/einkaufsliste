export interface Parser<T> {
  parse (input: string): T;
}
