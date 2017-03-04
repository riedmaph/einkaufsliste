import { ListItem } from './list-item.model';

export interface List {
  id: string;
  name: string;
  shared: boolean;
  owner: string;

  items?: ListItem[];
  count?: number;
  completed?: number;
}
