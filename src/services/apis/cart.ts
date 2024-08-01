import axios from "axios";
import { axiosInstance, reqConfig } from "../axios";
import { Category, ProductDetail } from "@/types/api";

const getProductWithCategoryID = async (
  categoryID: string
): Promise<ProductDetail[] | undefined> => {
  try {
    const res = await axiosInstance.get<{
      info: ProductDetail[];
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
  }
};

const getCategories = async (): Promise<Category[] | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: Category[] }>(
      "/categories",
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

export { getCategories, getProductWithCategoryID };
