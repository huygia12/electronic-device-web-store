import axios from "axios";
import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
  reqConfig,
} from "@/config";
import { Provider } from "@/types/model";

const providerService = {
  apis: {
    getProviders: async (): Promise<Provider[]> => {
      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: Provider[];
        }>("/providers", reqConfig);
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
    addProvider: async (name: string) => {
      const response = await axiosInstance.post(
        "/providers",
        {
          providerName: name,
        },
        reqConfig
      );

      return response;
    },
    updateProvider: async (providerID: string, newName: string) => {
      const response = await axiosInstance.put(
        `/providers/${providerID}`,
        {
          providerName: newName,
        },
        reqConfig
      );

      return response;
    },
    deleteProvider: async (providerID: string) => {
      const response = await axiosInstance.delete(
        `/providers/${providerID}`,
        reqConfig
      );

      return response;
    },
  },
};

export default providerService;
