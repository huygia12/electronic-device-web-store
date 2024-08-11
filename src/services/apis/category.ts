import { Category } from "@/types/api";
import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
  reqConfig,
} from "../axios";
import axios from "axios";

const categoryApis = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await axiosInstanceWithoutAuthorize.get<{ info: Category[] }>(
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
        }
      } else {
        // General error handling
        console.error("Unexpected error:", error);
      }
      return [];
    }
  },
  addCategory: async (name: string) => {
    const response = await axiosInstance.post(
      "/categories",
      {
        categoryName: name,
      },
      reqConfig
    );

    return response;
  },
  updateCategory: async (categoryID: string, newName: string) => {
    const response = await axiosInstance.put(
      `/categories/${categoryID}`,
      {
        categoryName: newName,
      },
      reqConfig
    );

    return response;
  },
  deleteCategory: async (categoryID: string) => {
    const response = await axiosInstance.delete(
      `/categories/${categoryID}`,
      reqConfig
    );

    return response;
  },
};

export default categoryApis;
