import { Error } from "@/types/error";
import { CartItem, ProductItem } from "@/types/model";

const cartService = {
  getTotalDiscountAmount: (items: CartItem[]): number => {
    return items.reduce(
      (prev, cur) =>
        prev + cur.price * ((cur.discount || 0) / 100) * cur.quantity,
      0
    );
  },
  getTotalAmount: (items: CartItem[]): number => {
    return items.reduce((prev, cur) => prev + cur.price * cur.quantity, 0);
  },
  deleteCartItem: (items: CartItem[], itemID: string): CartItem[] => {
    return items.filter((item) => item.itemID !== itemID);
  },
  updateItemQuantityy: (
    items: CartItem[],
    itemID: string,
    newQuantity: number
  ): CartItem[] => {
    return items.map((item) =>
      item.itemID === itemID
        ? {
            ...item,
            quantity: newQuantity,
          }
        : item
    );
  },
  updateQuantityErrors: (
    prevErrors: Error[],
    indexOfRow: number,
    newQuantity: number
  ): Error[] => {
    return prevErrors.map<Error>((element, index) => {
      if (index === indexOfRow) {
        if (newQuantity < 1) {
          return {
            success: false,
            message: "Không hợp lệ!",
          };
        } else {
          return { success: true };
        }
      }
      return element;
    });
  },
  handleAddToCart: (
    productItem: ProductItem,
    validQuantity: number,
    prevCartItems: CartItem[]
  ): { newCartItems: CartItem[]; checkExisted: boolean } => {
    let checkExisted: boolean = false;

    const newCartItems = prevCartItems.map((item) => {
      if (
        item.itemID === productItem.itemID &&
        item.productID === productItem.productID
      ) {
        item.quantity += validQuantity;
        checkExisted = true;
      }
      return item;
    });

    return { newCartItems, checkExisted };
  },
};

export default cartService;
