import axios from "axios";
import { axiosInstance, reqConfig } from "../axios";
import { ProductFullJoin } from "@/types/api";

const getProductWithCategoryID = async (
  categoryID: string
): Promise<ProductFullJoin[] | undefined> => {
  try {
    const res = await axiosInstance.get<{
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
  }
};

export { getProductWithCategoryID };
