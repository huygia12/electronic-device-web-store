import { Statistic } from "@/types/api";
import { axiosInstance, reqConfig } from "../axios";
import axios from "axios";
import { Nullable } from "@/utils/declare";

const statisticApis = {
  getStatistic: async (): Promise<Nullable<Statistic>> => {
    try {
      const res = await axiosInstance.get<{ info: Statistic }>(
        "/statistic",
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
      return null;
    }
  },
};

export default statisticApis;
