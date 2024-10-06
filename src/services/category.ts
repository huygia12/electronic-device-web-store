import { Category } from "@/types/model";
import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
  reqConfig,
} from "@/config";
import axios from "axios";

const categoryService = {
  apis: {
    getCategories: async (): Promise<Category[]> => {
      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: Category[];
        }>("/categories", reqConfig);
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
    addCategory: async (name: string): Promise<Category> => {
      const response = await axiosInstance.post<{ info: Category }>(
        "/categories",
        {
          categoryName: name,
        },
        reqConfig
      );

      return response.data.info;
    },
    updateCategory: async (
      categoryID: string,
      newName: string
    ): Promise<Category> => {
      const response = await axiosInstance.put<{ info: Category }>(
        `/categories/${categoryID}`,
        {
          categoryName: newName,
        },
        reqConfig
      );

      return response.data.info;
    },
    deleteCategory: async (categoryID: string) => {
      const response = await axiosInstance.delete(
        `/categories/${categoryID}`,
        reqConfig
      );

      return response;
    },
  },
  getSearchingResult: (text: string, categories: Category[]) => {
    return categories.filter((category) =>
      category.categoryName.toLowerCase().includes(text.toLowerCase())
    );
  },
  addCategory: (category: Category, categories: Category[]): Category[] => {
    return [category, ...categories];
  },
  updateCategory: (category: Category, categories: Category[]): Category[] => {
    return [
      category,
      ...categories.filter((e) => e.categoryID !== category.categoryID),
    ];
  },
  deleteCategory: (category: Category, categories: Category[]): Category[] => {
    return [...categories.filter((e) => e.categoryID !== category.categoryID)];
  },
};

export default categoryService;
