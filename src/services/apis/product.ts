import axios from "axios";
import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
  reqConfig,
} from "../axios";
import { Args, Nullable } from "@/utils/declare";
import { ProductFullJoin, ProductSummary } from "@/types/api";
import { ProductInputFormProps } from "@/utils/schema";
import productService from "@/utils/product";
import { firebaseApis } from ".";

const productApis = {
  getProductsSummary: async (): Promise<ProductSummary[]> => {
    try {
      const res = await axiosInstanceWithoutAuthorize.get<{
        info: ProductSummary[];
      }>(`/products?detail=1`, reqConfig);

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
      return [];
    }
  },
  getProductsFullJoinWithCategoryID: async (
    categoryID: string
  ): Promise<ProductFullJoin[]> => {
    try {
      const res = await axiosInstanceWithoutAuthorize.get<{
        info: ProductFullJoin[];
      }>(`/products?categoryID=${categoryID}`, reqConfig);

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
      return [];
    }
  },
  getProductsFullJoinWithProviderID: async (
    providerID: string
  ): Promise<ProductFullJoin[]> => {
    try {
      const res = await axiosInstanceWithoutAuthorize.get<{
        info: ProductFullJoin[];
      }>(`/products?providerID=${providerID}`, reqConfig);

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
      return [];
    }
  },
  getProductFullJoin: async ({
    params,
  }: Args): Promise<Nullable<ProductFullJoin>> => {
    try {
      const res = await axiosInstanceWithoutAuthorize.get<{
        info: ProductFullJoin;
      }>("/products/" + params.id, reqConfig);
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
        firebaseApis.deleteImagesInFireBase(
          getResponse.data.info.productItems.map((item) => item.thump)
        );
      }
      getResponse.data.info.productItems.forEach((item) => {
        firebaseApis.deleteImagesInFireBase(
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
          firebaseApis.deleteImagesInFireBase([item.thump, ...item.itemImages]);
        });
      }
      return false;
    }
  },
};

export default productApis;
