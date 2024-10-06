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
    addProvider: async (name: string): Promise<Provider> => {
      const response = await axiosInstance.post<{ info: Provider }>(
        "/providers",
        {
          providerName: name,
        },
        reqConfig
      );

      return response.data.info;
    },
    updateProvider: async (
      providerID: string,
      newName: string
    ): Promise<Provider> => {
      const response = await axiosInstance.put<{ info: Provider }>(
        `/providers/${providerID}`,
        {
          providerName: newName,
        },
        reqConfig
      );

      return response.data.info;
    },
    deleteProvider: async (providerID: string) => {
      const response = await axiosInstance.delete(
        `/providers/${providerID}`,
        reqConfig
      );

      return response;
    },
  },
  getSearchingResult: (text: string, providers: Provider[]) => {
    return providers.filter((provider) =>
      provider.providerName.toLowerCase().includes(text.toLowerCase())
    );
  },
  addProvider: (provider: Provider, providers: Provider[]): Provider[] => {
    return [provider, ...providers];
  },
  updateProvider: (provider: Provider, providers: Provider[]): Provider[] => {
    return [
      provider,
      ...providers.filter((e) => e.providerID !== provider.providerID),
    ];
  },
  deleteProvider: (provider: Provider, providers: Provider[]): Provider[] => {
    return [...providers.filter((e) => e.providerID !== provider.providerID)];
  },
};

export default providerService;
