import { ListItem } from './list-item.model';

export interface List {
  id: string;
  name: string;

  items?: ListItem[];
  count?: number;
  completed?: number;
}
