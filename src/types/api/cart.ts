interface CartItem {
  productName: string;
  price: number;
  quantity: number;
  discount: number;
  productCode: string;
  colorName: string;
  storageName: string | null;

  id?: string;
  height?: number;
  weight?: number;
  len?: number;
  width?: number;
  itemID?: string;
  thump?: string;
}

export type { CartItem };
