import { ReviewFullJoin } from "@/types/api";
import { axiosInstanceWithoutAuthorize, reqConfig } from "../axios";
import axios from "axios";

const reviewApis = {
  getReviews: async (productID?: string): Promise<ReviewFullJoin[]> => {
    let path = "/reviews";
    if (productID) {
      path += `?productID=${productID}`;
    }
    try {
      const res = await axiosInstanceWithoutAuthorize.get<{
        info: ReviewFullJoin[];
      }>(path, reqConfig);
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
};

export default reviewApis;
