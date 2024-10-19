import { AxiosResponse } from "axios";
import { axiosInstance, reqConfig } from "@/config";
import { Args } from "@/utils/helpers";
import { ProductSummary } from "@/types/payload";
import { Product } from "@/types/model";
import {
  ProductAttributesFormProps,
  ProductInsertionFormProps,
  ProductItemsInsertionFormProps,
  ProductItemsUpdateFormProps,
  ProductUpdateFormProps,
} from "@/utils/schema";
import { Attribute, AttributeOption, ProductItem } from "@/types/model";
import firebaseService from "./firebase";

const productEndPoint = "/products";

const productService = {
  apis: {
    getProductsSummary: async (params: {
      searching?: string;
      categoryID?: string;
      providerID?: string;
      currentPage?: number;
    }): Promise<{ products: ProductSummary[]; totalProducts: number }> => {
      let path: string = `${productEndPoint}?`;
      params.searching && (path = `${path}&searching=${params.searching}`);
      params.providerID && (path = `${path}&providerID=${params.providerID}`);
      params.categoryID && (path = `${path}&categoryID=${params.categoryID}`);
      params.currentPage &&
        (path = `${path}&currentPage=${params.currentPage}`);

      try {
        const res = await axiosInstance.get<{
          info: { products: ProductSummary[]; totalProducts: number };
        }>(path);

        return res.data.info;
      } catch (error) {
        console.error("Unexpected error: ", error);
        return { products: [], totalProducts: 0 };
      }
    },
    getProductsFullJoin: async (
      queryParams: Record<string, string>
    ): Promise<{ products: Product[]; totalProducts: number }> => {
      const res = await axiosInstance.get<{
        info: { products: Product[]; totalProducts: number };
      }>(`${productEndPoint}?detail=true`, { params: queryParams });

      return res.data.info;
    },
    getProductFullJoin: async (args: Args | string): Promise<Product> => {
      let productID: string;
      if (typeof args === "string") {
        productID = args;
      } else {
        productID = args.params.id!;
      }

      const res = await axiosInstance.get<{
        info: Product;
      }>(`${productEndPoint}/${productID}`);

      return res.data.info;
    },
    deleteProduct: async (
      productID: string,
      deepClean?: boolean
    ): Promise<AxiosResponse> => {
      //Get product so that we can delete it images
      const resOfGet = await axiosInstance.get<{
        info: Product;
      }>(`${productEndPoint}/${productID}`);

      //Delete product
      const resOfDelete = await axiosInstance.delete(
        `${productEndPoint}/${productID}`,
        reqConfig
      );

      if (deepClean) {
        firebaseService.apis.deleteImagesInFireBase(
          resOfGet.data.info.productItems.map((item) => item.thump)
        );
      }
      resOfGet.data.info.productItems.forEach((item) => {
        firebaseService.apis.deleteImagesInFireBase(
          item.itemImages.map((imageObject) => imageObject.source)
        );
      });

      return resOfDelete;
    },
    addProduct: async (
      product: ProductInsertionFormProps,
      productAttributeOptions: string[] | undefined,
      productItems: ProductItemsInsertionFormProps
    ): Promise<AxiosResponse> => {
      const productPayload = {
        productName: product.productName,
        description:
          product.description && product.description.length > 0
            ? product.description
            : undefined,
        length: product.length,
        width: product.width,
        height: product.height,
        weight: product.weight,
        warranty: product.warranty,
        categoryID: product.categoryID,
        providerID: product.providerID,
        options: productAttributeOptions,
        productItems: productItems,
      };

      const res = await axiosInstance.post(
        `${productEndPoint}`,
        productPayload,
        reqConfig
      );

      return res;
    },
    updateProduct: async (
      productID: string,
      product: ProductUpdateFormProps,
      productAttributeOptions: string[] | undefined,
      productItems: ProductItemsUpdateFormProps,
      removedItem: ProductItemsUpdateFormProps
    ): Promise<AxiosResponse> => {
      const productPayload = {
        productName: product.productName,
        description:
          product.description && product.description.length > 0
            ? product.description
            : undefined,
        length: product.length,
        width: product.width,
        height: product.height,
        weight: product.weight,
        warranty: product.warranty,
        categoryID: product.categoryID,
        providerID: product.providerID,
        options: productAttributeOptions,
        productItems: productItems,
      };

      const res = await axiosInstance.put(
        `${productEndPoint}/${productID}`,
        productPayload,
        reqConfig
      );

      for (const item of removedItem) {
        if (!(item.itemImages instanceof FileList)) {
          firebaseService.apis.deleteImagesInFireBase(item.itemImages);
        }
        if (!(item.thump instanceof FileList)) {
          firebaseService.apis.deleteImagesInFireBase(item.thump);
        }
      }

      return res;
    },
  },
  getPriceRange: (product: Product): string => {
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
  getSaleRange: (product: Product): string => {
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
    product: Product,
    item: ProductItem | string,
    quantity: number
  ) => {
    let itemToAdd: ProductItem | undefined;
    if (typeof item === "string") {
      itemToAdd = product.productItems.find((i) => i.itemID === item);
    } else {
      itemToAdd = item;
    }

    if (!itemToAdd) {
      throw new Error(`Item cannot be found in product: ${product.productID}`);
    }

    return {
      productName: product.productName,
      price: itemToAdd.price,
      quantity: quantity,
      discount: itemToAdd.discount,
      productCode: itemToAdd.productCode,
      color: itemToAdd.color,
      storage: itemToAdd.storage,
      thump: itemToAdd.thump,
      productID: product.productID,
      itemID: itemToAdd.itemID,
      height: product.height,
      length: product.length,
      width: product.width,
      weight: product.weight,
    };
  },
  getAttributesOutOfProduct: (products: Product[]): Attribute[] => {
    const attributes = products.reduce<Attribute[]>((prev, curr) => {
      curr.productAttributes.map((item) => {
        const attributeHolder: Attribute | undefined = prev.find(
          (attribute) => attribute.typeID === item.attributeOption.typeID
        );
        const optionHolder: AttributeOption | undefined =
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
  getAttributeOptionsOutOfProduct: (
    product: Product
  ): ProductAttributesFormProps => {
    return product.productAttributes.reduce<ProductAttributesFormProps>(
      (prev, curr) => {
        prev.push({
          typeID: curr.attributeOption.typeID,
          typeValue: curr.attributeOption.attributeType.typeValue,
          optionID: curr.attributeOption.optionID,
          optionValue: curr.attributeOption.optionValue,
        });
        return prev;
      },
      []
    );
  },
  isContainAllRequiredAttributeOptions: (
    product: Product,
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
  getProductItemsAfterUploadImages: async (
    productItems: ProductItemsInsertionFormProps
  ): Promise<{
    items: ProductItemsInsertionFormProps;
    uploadedImage: string[];
  }> => {
    const items = [];
    let images: string[] = [];
    for (const item of productItems) {
      let thump: string[];
      if (typeof item.thump === "string") {
        thump = [item.thump];
      } else {
        thump = await firebaseService.apis.insertImagesToFireBase(
          item.thump,
          `products/thump`
        );
        images.push(thump[0]);
      }

      let productImages: string[];
      if (item.itemImages instanceof FileList) {
        productImages = await firebaseService.apis.insertImagesToFireBase(
          item.itemImages,
          `products`
        );
        images = images.concat(productImages);
      } else {
        productImages = item.itemImages;
      }

      items.push({
        thump: thump[0],
        quantity: item.quantity,
        price: item.price,
        productCode: item.productCode,
        discount: item.discount,
        color: item.color,
        storage: item.storage,
        itemImages: productImages,
      });
    }

    return { items, uploadedImage: images };
  },
  handleConsequencesIfCUProductFail: (urls: string[]) => {
    firebaseService.apis.deleteImagesInFireBase(urls);
  },
  getProductUpdateDefaultValue: (product: Product): ProductUpdateFormProps => {
    return {
      productName: product.productName,
      description: product.description || undefined,
      length: product.length,
      width: product.width,
      height: product.height,
      weight: product.weight,
      warranty: product.warranty,
      categoryID: product.category.categoryID,
      providerID: product.provider.providerID,
      productAttributes:
        productService.getAttributeOptionsOutOfProduct(product),
      productItems: product.productItems.map((item) => {
        return {
          ...item,
          itemImages: item.itemImages.map((image) => image.source),
        };
      }),
    };
  },
  createNewItemHolder: () => {
    return {
      thump: null,
      quantity: null,
      price: null,
      productCode: "",
      discount: 0,
      color: "",
      storage: "",
      itemImages: null,
    };
  },
};

export default productService;
