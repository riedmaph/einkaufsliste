export interface ListItem {
  uuid?: string;
  name: string;
  unit: string;
  amount: number;
  onSale?: boolean;
  checked?: boolean;
}
