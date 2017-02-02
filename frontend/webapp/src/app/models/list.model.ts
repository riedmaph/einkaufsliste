import { ListItem } from './list-item.model';

export interface List {
  id: string;
  name: string;

  items?: ListItem[];
  count?: number;
  completed?: number;
  shared?: boolean; // make obligatory after backend update
  sharedWith?: string[]; // update to persons (TODO person.model) when backend is updated 
}
