import axios from "axios";
import { axiosInstance, reqConfig } from "../axios";
import { Provider } from "@/types/api";

const getProviders = async (): Promise<Provider[] | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: Provider[] }>(
      "/providers",
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
  }
};

export { getProviders };
