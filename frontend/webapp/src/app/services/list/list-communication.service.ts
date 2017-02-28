import { Injectable } from '@angular/core';

import { List } from '../../models';

@Injectable()
export class ListCommunicationService {
  public lists: List[] = [ ];
}
