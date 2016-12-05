export interface Token {}

export class StringToken implements Token {
  constructor (public val: string) { }
}

export class NumberToken implements Token {
  constructor (public val: number) { }
}
