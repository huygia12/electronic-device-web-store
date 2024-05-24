/**
 * Apply discount to an amount of money(vnd)
 *
 * @param {number} price - The money amount(vnd).
 * @param {number} discount - The discount amount(%)
 * @returns The discounted amount.
 */
const afterDiscount = (price: number, discount: number): number => {
  return price * (1 - discount / 100);
};

/**
 * This function is used to convert money amount(vnd) to VND format.
 *
 * @param {number} price - The money amount(vnd).
 * @returns {string} The money in VND format.
 */
const toVND = (price: number): string => {
  let priceInN: number = Number(price.toFixed(0));
  let soDu: number;
  let result: string = "";

  while (priceInN >= 1000) {
    soDu = priceInN % 1000;
    result = "." + (soDu === 0 ? "000" : soDu) + result;
    priceInN = Math.floor(priceInN / 1000);
  }

  return priceInN + result + "₫";
};

export { afterDiscount, toVND };
