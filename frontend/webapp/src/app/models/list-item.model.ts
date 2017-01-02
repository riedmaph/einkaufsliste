export type Unit = 'stk' | 'kg' | 'g' | 'l' | 'ml';

export interface ListItem {
  listUuid?: string;
  id?: string;
  name: string;
  unit: string;
  amount: number;
  onSale?: boolean;
  checked?: boolean;
}
