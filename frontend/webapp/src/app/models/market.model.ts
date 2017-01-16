export interface Market {
  id: number;

  name: string;

  longitude: number;
  latitude: number;

  street: string;
  zip: string;
  city: string;

  colour?: string;
}
