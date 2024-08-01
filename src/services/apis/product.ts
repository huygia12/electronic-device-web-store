import axios from "axios";
import { axiosInstance, reqConfig } from "../axios";
import { Args } from "@/utils/declare";
import { Product, ProductSummary } from "@/types/api";

const getProducts = async (): Promise<ProductSummary[] | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: ProductSummary[] }>(
      "/products",
      reqConfig
    );

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
  }
};

const getProductDetail = async ({
  params,
}: Args): Promise<Product | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: Product }>(
      "/products/" + params.id,
      reqConfig
    );
    // console.log(JSON.stringify(res.data.info));
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
  }
};

export { getProducts, getProductDetail };
