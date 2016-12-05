import { Injectable } from '@angular/core';

import { ListItem } from '../../models';
import { Parser } from './parser.interface';
import {
  Token,
  NumberToken,
  StringToken,
} from './tokens';

@Injectable()
export class ListItemParser implements Parser<ListItem> {

  public parse (input: string): ListItem {
    const tokens = this.lex(input);
    console.info(tokens);
    return null;
  }

  private lex (input: string): Token[] {
    const chunks: string[] = input.split(/\s+/);
    return chunks.map(chunk => {
      if (parseInt(chunk, 10).toString() === chunk) {
        return new NumberToken(parseInt(chunk, 10));
      } else {
        return new StringToken(chunk);
      }
    });
  }

}
