import { Product } from "@/declare";

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

export { afterDiscount, getAverageRatingPoint };
