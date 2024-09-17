import { CartItem } from "@/types/model";

const cartService = {
  apis: {},
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
};

export default cartService;
