import { ListItem } from './list-item.model';

export interface List {
  id: string;
  name: string;

  items?: ListItem[];
  count?: number;
  completed?: number;
  sharedWith?: string[]; // change to obligatory attribute when backend is updated 
}
