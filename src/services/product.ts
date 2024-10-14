import axios, { AxiosResponse } from "axios";
import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
  reqConfig,
} from "@/config";
import { Args, Optional } from "@/utils/declare";
import { ProductSummary } from "@/types/api";
import { ProductFullJoin } from "@/types/model";
import {
  ProductAttributesFormProps,
  ProductInputFormProps,
  ProductItemsFormProps,
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
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: { products: ProductSummary[]; totalProducts: number };
        }>(path);

        return res.data.info;
      } catch (error) {
        console.error("Unexpected error: ", error);
        return { products: [], totalProducts: 0 };
      }
    },
    getProductsFullJoin: async (params: {
      categoryID?: string;
      providerID?: string;
      saleArrange?: boolean;
    }): Promise<ProductFullJoin[]> => {
      let path = `${productEndPoint}?detail=true`;
      params.categoryID && (path += `&categoryID=${params.categoryID}`);
      params.providerID && (path += `&providerID=${params.providerID}`);
      params.saleArrange && (path += `&saleArrange=${params.saleArrange}`);

      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: { products: ProductFullJoin[] };
        }>(path);

        return res.data.info.products;
      } catch (error) {
        console.error("Unexpected error: ", error);
        return [];
      }
    },
    getProductFullJoin: async (
      args: Args | string
    ): Promise<ProductFullJoin> => {
      let productID: string;
      if (typeof args === "string") {
        productID = args;
      } else {
        productID = args.params.id!;
      }

      const res = await axiosInstanceWithoutAuthorize.get<{
        info: ProductFullJoin;
      }>(`/products/${productID}`, reqConfig);

      return res.data.info;
    },
    deleteProduct: async (
      productID: string,
      deepClean?: boolean
    ): Promise<AxiosResponse> => {
      //Get product so that we can delete it images
      const resOfGet = await axiosInstanceWithoutAuthorize.get<{
        info: ProductFullJoin;
      }>(`/products/${productID}`, reqConfig);

      //Delete product
      const resOfDelete = await axiosInstance.delete(
        `/products/${productID}`,
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
      product: ProductInputFormProps,
      productAttributeOptions: string[] | undefined,
      productItems: ProductItemsFormProps
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
        "/products",
        productPayload,
        reqConfig
      );

      return res;
    },
    updateProduct: async (product: ProductInputFormProps): Promise<boolean> => {
      // TODO:
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
  getAttributeOptionsOutOfProduct: (
    product: ProductFullJoin
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
  ): Promise<ProductItemsFormProps> => {
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
  handleConsequencesIfAddProductFail: (items: ProductItemsFormProps) => {
    items.forEach((item) => {
      firebaseService.apis.deleteImagesInFireBase([
        item.thump,
        ...item.itemImages,
      ]);
    });
  },
  getProductUpdateDefaultValue: (
    product: ProductFullJoin
  ): ProductUpdateFormProps => {
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
      productItems: product.productItems,
    };
  },
};

export default productService;
