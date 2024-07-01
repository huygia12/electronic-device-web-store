import { deleteImageFromFireBase, insertImageToFireBase } from "@/api/firebase";
import {
  CartItem,
  Product,
  ProductItemInput,
  ProductItemInsertPayload,
  ProductItemUpdate,
} from "@/declare";

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

const getPriceRange = (product: Product): string => {
  const len = product.items.length;
  if (len === -1) {
    /** Doesnt have any items */
    return "";
  } else if (len === 0) {
    /** Have only one item */
    return product.items[-1].price.toLocaleString();
  }

  /** Find and return the range*/
  let min: number = product.items[-1].price;
  let max: number = product.items[-1].price;
  product.items.forEach((item) => {
    if (item.price < min) {
      min = item.price;
    }
    if (item.price > max) {
      max = item.price;
    }
  });

  if (min == max) {
    return min.toLocaleString();
  }

  return `${min.toLocaleString()} - ${max.toLocaleString()}`;
};

const getSaleRange = (product: Product): string => {
  const len = product.items.length;
  if (len === -1) {
    /** Doesnt have any items */
    return "";
  } else if (len === 0) {
    /** Have only one item */
    return String(product.items[-1].discount);
  }

  /** Find and return the range*/
  let min: number = product.items[-1].discount ?? 0;
  let max: number = product.items[-1].discount ?? 0;
  product.items.forEach((item) => {
    if (!item.discount) return;
    if (item.discount < min) {
      min = item.discount;
    }
    if (max && item.discount > max) {
      max = item.discount;
    }
  });

  if (min == max) {
    return String(min);
  }

  return `${min}-${max}`;
};

// const getImgsUrl = (rawUrls: Promise<string>[]) => {
//   const bucket: string[] = [];
//   for (const item in rawUrls) {
//     bucket.push(item);
//   }
//   console.log(bucket);
//   return bucket;
// };

const getItemList = async (
  rawItems: ProductItemInput[]
): Promise<ProductItemInsertPayload[]> => {
  const items: ProductItemInsertPayload[] = [];
  for (const item of rawItems) {
    const rawImgUrls =
      item.images &&
      (await Promise.all(
        item.images.map(async (file) => {
          return await insertImageToFireBase(file, "products");
        })
      ));

    const rawThumpUrl =
      item.thump && (await insertImageToFireBase(item.thump, "products"));

    if (rawThumpUrl) {
      const thumpUrl = await Promise.resolve(rawThumpUrl);
      if (rawImgUrls) {
        console.log("true");
        items.push({
          thump: thumpUrl,
          quantity: item.quantity,
          price: item.price,
          productCode: item.productCode && item.productCode.trim(),
          discount: item.discount,
          colorName: item.colorName && item.colorName.trim(),
          storageName: item.storageName && item.storageName.trim(),
          images: rawImgUrls,
        });
      }
    }
  }
  return items;
};

const getItemsUpdatePayload = async (
  rawItems: ProductItemUpdate[]
): Promise<ProductItemInsertPayload[]> => {
  const items: ProductItemInsertPayload[] = [];
  for (const item of rawItems) {
    const rawImgUrls =
      item.images &&
      (await Promise.all(
        item.images.map(async (file) => {
          return file instanceof File
            ? await insertImageToFireBase(file, "products")
            : file;
        })
      ));

    const rawThumpUrl =
      item.thump instanceof File
        ? await insertImageToFireBase(item.thump, "products")
        : item.thump;

    if (rawThumpUrl) {
      const thumpUrl = await Promise.resolve(rawThumpUrl);
      if (rawImgUrls) {
        console.log("true");
        items.push({
          thump: thumpUrl,
          quantity: item.quantity,
          price: item.price,
          productCode: item.productCode && item.productCode.trim(),
          discount: item.discount,
          colorName: item.colorName && item.colorName.trim(),
          storageName: item.storageName && item.storageName.trim(),
          images: rawImgUrls,
        });
      }
    }
  }
  return items;
};

const clearImagesInFB = async (imageUrls: string[]) => {
  await Promise.all(
    imageUrls.map(async (imageUrl) => {
      await deleteImageFromFireBase(imageUrl);
    })
  );
};
export {
  afterDiscount,
  getAverageRatingPoint,
  getTotalDiscountAmount,
  getTotalAmount,
  getPriceRange,
  getSaleRange,
  getItemList,
  getItemsUpdatePayload,
  clearImagesInFB,
};
