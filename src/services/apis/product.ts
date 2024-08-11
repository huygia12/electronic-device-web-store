import axios from "axios";
import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
  reqConfig,
} from "../axios";
import { Args, Nullable } from "@/utils/declare";
import { ProductFullJoin, ProductSummary } from "@/types/api";

const productApis = {
  getProductsSummary: async (): Promise<ProductSummary[]> => {
    try {
      const res = await axiosInstanceWithoutAuthorize.get<{
        info: ProductSummary[];
      }>("/products", reqConfig);

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
  deleteProduct: async (productID: string) => {
    //TODO: need to delete images in database
    const res = await axiosInstance.delete(`/products/${productID}`, reqConfig);
    return res;
  },
  // addProduct: async (product: ProductFullJoin) => {},
};

export default productApis;
