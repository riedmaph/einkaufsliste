import { Injectable } from '@angular/core';

import { ListItem } from 'app/models';
import { Parser } from '../parser.interface';

import { PegParser } from './parser.peg';

@Injectable()
export class ListItemParser implements Parser<ListItem> {
  public parse (input: string): ListItem {
    return <ListItem> PegParser.parse(input);
  }
}
