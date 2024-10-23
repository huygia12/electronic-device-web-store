import { Category } from "@/types/model";
import { axiosInstance } from "@/config";

const categoryEndpoint = "/categories";

const categoryService = {
  apis: {
    getCategories: async (): Promise<Category[]> => {
      try {
        const res = await axiosInstance.get<{
          info: Category[];
        }>(`${categoryEndpoint}`);
        return res.data.info;
      } catch (error) {
        console.error("Unexpected error:", error);
        return [];
      }
    },
    addCategory: async (name: string): Promise<Category> => {
      const response = await axiosInstance.post<{ info: Category }>(
        `${categoryEndpoint}`,
        {
          categoryName: name,
        }
      );

      return response.data.info;
    },
    updateCategory: async (
      categoryID: string,
      newName: string
    ): Promise<Category> => {
      const response = await axiosInstance.put<{ info: Category }>(
        `${categoryEndpoint}/${categoryID}`,
        {
          categoryName: newName,
        }
      );

      return response.data.info;
    },
    deleteCategory: async (categoryID: string) => {
      const response = await axiosInstance.delete(
        `${categoryEndpoint}/${categoryID}`
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
