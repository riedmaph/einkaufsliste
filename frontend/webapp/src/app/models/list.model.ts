import { ListItem } from './list-item.model';

export interface List {
  uuid: string;
  name: string;

  items?: ListItem[];
  count?: number;
}
