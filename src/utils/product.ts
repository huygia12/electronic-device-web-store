import { CartItem, Product } from "@/declare";

/**
 * Apply discount to an amount of money(vnd)
 *
 * @param {number} price - The money amount(vnd)
 * @param {number} discount - The discount amount(%)
 * @returns The discounted amount
 */
const afterDiscount = (price: number, discount: number): number => {
  return price * (1 - discount / 100);
};

/**
 * Compute the average rating-point of a product
 *
 * @param {Product} product
 * @returns Average rating-point
 */
const getAverageRatingPoint = (product: Product): number => {
  return (
    product.reviews.reduce((prev, cur) => prev + cur.rating, 0) /
    product.reviews.length
  );
};

/**
 * Make sum from the discounted amount of all CartItems
 *
 * @param {CartItem[]} items - The list of CartItem
 * @returns The total discounted amount
 */
const getTotalDiscountAmount = (items: CartItem[]): number => {
  return items.reduce(
    (prev, cur) => prev + cur.price * (cur.discount / 100) * cur.quantity,
    0
  );
};

/**
 * Caculate the raw total ammount of the bill(CartItems)
 *
 * @param {CartItem[]} items - The list of CartItem
 * @returns The totals
 */
const getTotalAmount = (items: CartItem[]): number => {
  return items.reduce((prev, cur) => prev + cur.price * cur.quantity, 0);
};

export {
  afterDiscount,
  getAverageRatingPoint,
  getTotalDiscountAmount,
  getTotalAmount,
};
