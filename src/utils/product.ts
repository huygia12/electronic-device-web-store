import { deleteImageFromFireBase } from "@/services/apis";
import {
  Attribute,
  AttributeOption,
  CartItem,
  ProductFullJoin,
  ProductItem,
  Review,
} from "@/types/api";
import { Nullable, Optional } from "./declare";

const productService = {
  isDiscount: (discount: Nullable<number>): boolean => {
    return discount !== null && discount > 0;
  },
  afterDiscount: (price: number, discount: Nullable<number>): number => {
    if (!discount) return price;
    return price * (1 - discount / 100);
  },
  getAverageRatingPoint: (reviews: Review[]): number => {
    return (
      reviews.reduce<number>((prev, cur) => prev + cur.rating, 0) /
      reviews.length
    );
  },
  getTotalDiscountAmount: (items: CartItem[]): number => {
    return items.reduce(
      (prev, cur) =>
        prev + cur.price * ((cur.discount || 100) / 100) * cur.quantity,
      0
    );
  },
  getTotalAmount: (items: CartItem[]): number => {
    return items.reduce((prev, cur) => prev + cur.price * cur.quantity, 0);
  },
  getPriceRange: (product: ProductFullJoin): string => {
    const len: number = product.productItems.length;
    if (len === 0) {
      /** Doesnt have any items */
      return "";
    } else if (len === 1) {
      /** Have only one item */
      return product.productItems[0].price.toLocaleString();
    }

    /** Find and return the range*/
    let min: number = product.productItems[0].price;
    let max: number = product.productItems[0].price;
    product.productItems.forEach((item) => {
      if (item.price < min) {
        min = item.price;
      }
      if (item.price > max) {
        max = item.price;
      }
    });

    if (min === max) {
      return min.toLocaleString();
    }

    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  },
  getSaleRange: (product: ProductFullJoin): string => {
    const len: number = product.productItems.length;
    if (len === 0) {
      /** Doesnt have any items */
      return "";
    } else if (len === 1) {
      /** Have only one item */
      return String(product.productItems[0].discount);
    }

    /** Find and return the range*/
    let min: number = product.productItems[0].discount ?? 0;
    let max: number = product.productItems[0].discount ?? 0;
    product.productItems.forEach((item) => {
      if (!item.discount) return;
      if (item.discount < min) {
        min = item.discount;
      }
      if (max && item.discount > max) {
        max = item.discount;
      }
    });

    if (min === max) {
      return String(min);
    }

    return `${min}-${max}`;
  },
  // const getImgsUrl = (rawUrls: Promise<string>[]) => {
  //   const bucket: string[] = [];
  //   for (const item in rawUrls) {
  //     bucket.push(item);
  //   }
  //   console.log(bucket);
  //   return bucket;
  // };
  // getItemList: async (
  //   rawItems: ProductItem[]
  // ): Promise<ProductItemInsertPayload[]> => {
  //   const items: ProductItemInsertPayload[] = [];
  //   for (const item of rawItems) {
  //     const rawImgUrls =
  //       item.images &&
  //       (await Promise.all(
  //         item.images.map(async (file) => {
  //           return await insertImageToFireBase(file, "products");
  //         })
  //       ));

  //     const rawThumpUrl =
  //       item.thump && (await insertImageToFireBase(item.thump, "products"));

  //     if (rawThumpUrl) {
  //       const thumpUrl = await Promise.resolve(rawThumpUrl);
  //       if (rawImgUrls) {
  //         console.log("true");
  //         items.push({
  //           thump: thumpUrl,
  //           quantity: item.quantity,
  //           price: item.price,
  //           productCode: item.productCode && item.productCode.trim(),
  //           discount: item.discount,
  //           colorName: item.colorName && item.colorName.trim(),
  //           storageName: item.storageName && item.storageName.trim(),
  //           images: rawImgUrls,
  //         });
  //       }
  //     }
  //   }
  //   return items;
  // },
  // getItemsUpdatePayload: async (
  //   rawItems: ProductItemUpdate[]
  // ): Promise<ProductItemInsertPayload[]> => {
  //   const items: ProductItemInsertPayload[] = [];
  //   for (const item of rawItems) {
  //     const rawImgUrls =
  //       item.images &&
  //       (await Promise.all(
  //         item.images.map(async (file) => {
  //           return file instanceof File
  //             ? await insertImageToFireBase(file, "products")
  //             : file;
  //         })
  //       ));

  //     const rawThumpUrl =
  //       item.thump instanceof File
  //         ? await insertImageToFireBase(item.thump, "products")
  //         : item.thump;

  //     if (rawThumpUrl) {
  //       const thumpUrl = await Promise.resolve(rawThumpUrl);
  //       if (rawImgUrls) {
  //         console.log("true");
  //         items.push({
  //           thump: thumpUrl,
  //           quantity: item.quantity,
  //           price: item.price,
  //           productCode: item.productCode && item.productCode.trim(),
  //           discount: item.discount,
  //           colorName: item.colorName && item.colorName.trim(),
  //           storageName: item.storageName && item.storageName.trim(),
  //           images: rawImgUrls,
  //         });
  //       }
  //     }
  //   }
  //   return items;
  // },
  clearImagesInFB: async (imageUrls: string[]) => {
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
        await deleteImageFromFireBase(imageUrl);
      })
    );
  },
  convertProductToCartItem: (
    product: ProductFullJoin,
    item: ProductItem,
    quantity: number
  ) => {
    return {
      productName: product.productName,
      price: item.price,
      quantity: quantity,
      discount: item.discount,
      productCode: item.productCode,
      color: item.color,
      storage: item.storage,
      thump: item.thump,
      productID: product.productID,
      itemID: item.itemID,
      height: product.height,
      length: product.length,
      width: product.width,
      weight: product.weight,
    };
  },
  getAttributesOutOfProduct: (products: ProductFullJoin[]): Attribute[] => {
    const attributes = products.reduce<Attribute[]>((prev, curr) => {
      curr.productAttributes.map((item) => {
        const attributeHolder: Optional<Attribute> = prev.find(
          (attribute) => attribute.typeID === item.attributeOption.typeID
        );
        const optionHolder: Optional<AttributeOption> =
          attributeHolder?.attributeOptions.find(
            (option) => option.optionID === item.attributeOption.optionID
          );
        if (attributeHolder) {
          !optionHolder &&
            attributeHolder.attributeOptions.push({
              typeID: item.attributeOption.typeID,
              optionID: item.attributeOption.optionID,
              optionValue: item.attributeOption.optionValue,
            });
        } else {
          prev.push({
            typeID: item.attributeOption.typeID,
            typeValue: item.attributeOption.attributeType.typeValue,
            attributeOptions: [
              {
                typeID: item.attributeOption.typeID,
                optionID: item.attributeOption.optionID,
                optionValue: item.attributeOption.optionValue,
              },
            ],
          });
        }
      });

      return prev;
    }, []);

    return attributes;
  },
  isContainAllRequiredAttributeOptions: (
    product: ProductFullJoin,
    attribute: AttributeOption[]
  ) => {
    const productOptions: string[] = product.productAttributes.reduce<string[]>(
      (prev, curr) => {
        prev.push(curr.attributeOption.optionID);
        return prev;
      },
      []
    );
    const attributeOptions: string[] = attribute.reduce<string[]>(
      (prev, curr) => {
        prev.push(curr.optionID);
        return prev;
      },
      []
    );

    const attributeSet = new Set(productOptions);
    for (const option of attributeOptions) {
      if (!attributeSet.has(option)) {
        return false;
      }
    }

    return true;
  },
};

export default productService;
