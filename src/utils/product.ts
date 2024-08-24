import {
  Attribute,
  AttributeOption,
  CartItem,
  ProductFullJoin,
  ProductItem,
  Review,
} from "@/types/api";
import { Nullable, Optional } from "./declare";
import { ProductItemsFormProps } from "@/utils/schema";

const productService = {
  getDiscount: (discount: Nullable<number>): number => {
    return discount ?? 0;
  },
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
        prev + cur.price * ((cur.discount || 0) / 100) * cur.quantity,
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
  retrieveImageUrl: (image: unknown): string => {
    if (typeof image === "string") {
      return image;
    } else if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    throw new Error("Invalid image!");
  },
  getProductItemsAfterUploadImages: (productItems: ProductItemsFormProps) => {
    const items = [];
    for (const item of productItems) {
      items.push({
        thump: "/black-thump.jpg",
        quantity: item.quantity,
        price: item.price,
        productCode: item.productCode,
        discount: item.discount,
        color: item.color,
        storage: item.storage,
        itemImages: item.itemImages.map(() => "/black-thump.jpg"),
      });
    }

    return items;
  },
};

export default productService;
