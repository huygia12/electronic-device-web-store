import axios from "axios";
import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
  reqConfig,
} from "@/config";
import { Args, Nullable, Optional } from "@/utils/declare";
import { ProductSummary } from "@/types/api";
import { ProductFullJoin } from "@/types/model";
import { ProductInputFormProps, ProductItemsFormProps } from "@/utils/schema";
import { Attribute, AttributeOption, ProductItem } from "@/types/model";
import firebaseService from "./firebase";

const productService = {
  apis: {
    getProductsSummary: async (params: {
      searching?: string;
      categoryID?: string;
      providerID?: string;
      currentPage?: number;
    }): Promise<{ products: ProductSummary[]; totalProducts: number }> => {
      let path: string = `/products?`;
      params.searching && (path = `${path}&searching=${params.searching}`);
      params.providerID && (path = `${path}&providerID=${params.providerID}`);
      params.categoryID && (path = `${path}&categoryID=${params.categoryID}`);
      params.currentPage &&
        (path = `${path}&currentPage=${params.currentPage}`);

      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: { products: ProductSummary[]; totalProducts: number };
        }>(path, reqConfig);

        return res.data.info;
      } catch (error) {
        console.error("Unexpected error: ", error);
        return { products: [], totalProducts: 0 };
      }
    },
    getProductsFullJoinWithCategoryID: async (
      categoryID: string
    ): Promise<ProductFullJoin[]> => {
      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: { products: ProductFullJoin[] };
        }>(`/products?detail=true&categoryID=${categoryID}`, reqConfig);

        return res.data.info.products;
      } catch (error) {
        console.error("Unexpected error: ", error);
        return [];
      }
    },
    getProductsFullJoinWithProviderID: async (
      providerID: string
    ): Promise<ProductFullJoin[]> => {
      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: { products: ProductFullJoin[] };
        }>(`/products?detail=true&providerID=${providerID}`, reqConfig);

        return res.data.info.products;
      } catch (error) {
        console.error("Unexpected error: ", error);
        return [];
      }
    },
    getProductFullJoin: async ({
      params,
    }: Args): Promise<Nullable<ProductFullJoin>> => {
      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: ProductFullJoin;
        }>(`/products/${params.id}`, reqConfig);
        return res.data.info;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          console.error("Axios error:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          console.error("Unexpected error:", error);
        }
        return null;
      }
    },
    deleteProduct: async (
      productID: string,
      deepClean?: boolean
    ): Promise<boolean> => {
      try {
        const getResponse = await axiosInstanceWithoutAuthorize.get<{
          info: ProductFullJoin;
        }>(`/products/${productID}`, reqConfig);

        await axiosInstance.delete(`/products/${productID}`, reqConfig);

        if (deepClean) {
          firebaseService.apis.deleteImagesInFireBase(
            getResponse.data.info.productItems.map((item) => item.thump)
          );
        }
        getResponse.data.info.productItems.forEach((item) => {
          firebaseService.apis.deleteImagesInFireBase(
            item.itemImages.map((imageObject) => imageObject.source)
          );
        });
        return true;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error(`Response data: ${error.response.data}`);
            console.error(`Response status: ${error.response.status})`);
          }
        } else {
          console.error("Unexpected error:", error);
        }
        return false;
      }
    },
    addProduct: async (product: ProductInputFormProps): Promise<boolean> => {
      let productPayload;
      try {
        let options = product.productAttributes?.reduce<string[]>(
          (prev, curr) => {
            prev.push(curr.optionID);
            return prev;
          },
          []
        );

        if (options) {
          if (options.length <= 0) {
            options = undefined;
          }
        }
        const productItems =
          await productService.getProductItemsAfterUploadImages(
            product.productItems
          );

        productPayload = {
          productName: product.productName,
          description:
            product.description?.length && product.description.length > 0
              ? product.description
              : undefined,
          length: product.length,
          width: product.width,
          height: product.height,
          weight: product.weight,
          warranty: product.warranty,
          categoryID: product.categoryID,
          providerID: product.providerID,
          options: options,
          productItems: productItems,
        };

        //post new product
        await axiosInstance.post("/products", productPayload, reqConfig);
        return true;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle error response if available
          console.error(`Response data: ${error.response?.data}`);
          console.error(`Response status: ${error.response?.status})`);
        } else {
          console.error("Unexpected error:", error);
        }

        if (productPayload) {
          productPayload.productItems.forEach((item) => {
            //delete images if add product fail
            firebaseService.apis.deleteImagesInFireBase([
              item.thump,
              ...item.itemImages,
            ]);
          });
        }
        return false;
      }
    },
    updateProduct: async (product: ProductInputFormProps): Promise<boolean> => {
      let productPayload;
      try {
        let options = product.productAttributes?.reduce<string[]>(
          (prev, curr) => {
            prev.push(curr.optionID);
            return prev;
          },
          []
        );

        if (options) {
          if (options.length <= 0) {
            options = undefined;
          }
        }
        const productItems =
          await productService.getProductItemsAfterUploadImages(
            product.productItems
          );

        productPayload = {
          productName: product.productName,
          description:
            product.description?.length && product.description.length > 0
              ? product.description
              : undefined,
          length: product.length,
          width: product.width,
          height: product.height,
          weight: product.weight,
          warranty: product.warranty,
          categoryID: product.categoryID,
          providerID: product.providerID,
          options: options,
          productItems: productItems,
        };

        //post new product
        await axiosInstance.post("/products", productPayload, reqConfig);
        return true;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle error response if available
          console.error(`Response data: ${error.response?.data}`);
          console.error(`Response status: ${error.response?.status})`);
        } else {
          console.error("Unexpected error:", error);
        }

        if (productPayload) {
          productPayload.productItems.forEach((item) => {
            //delete images if add product fail
            firebaseService.apis.deleteImagesInFireBase([
              item.thump,
              ...item.itemImages,
            ]);
          });
        }
        return false;
      }
    },
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
  getProductItemsAfterUploadImages: async (
    productItems: ProductItemsFormProps
  ) => {
    const items = [];
    for (const item of productItems) {
      const thump: string[] = await firebaseService.apis.insertImagesToFireBase(
        item.thump,
        `test/thump`
      );
      const productImages: string[] =
        await firebaseService.apis.insertImagesToFireBase(
          item.itemImages,
          `test`
        );

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

    return items;
  },
};

export default productService;
