export interface Location {
  id: string;
  name: string;
}

export interface InventoryItem {
  id?: string;
  name: string;
  locationId: string;
  price: number;
  location: Location;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateInventoryItem {
  name: string;
  locationId: string;
  price: number;
}

export interface Statistics {
  locationName: string;
  totalProducts: number;
  totalPrice: number;
}
