import { axiosInstance, reqConfig } from "@/config";
import { Provider } from "@/types/model";

const providerEndpoint = "/providers";

const providerService = {
  apis: {
    getProviders: async (): Promise<Provider[]> => {
      try {
        const res = await axiosInstance.get<{
          info: Provider[];
        }>(`${providerEndpoint}`);
        return res.data.info;
      } catch (error) {
        console.error("Unexpected error:", error);
        return [];
      }
    },
    addProvider: async (name: string): Promise<Provider> => {
      const response = await axiosInstance.post<{ info: Provider }>(
        `${providerEndpoint}`,
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
        `${providerEndpoint}/${providerID}`,
        {
          providerName: newName,
        },
        reqConfig
      );

      return response.data.info;
    },
    deleteProvider: async (providerID: string) => {
      const response = await axiosInstance.delete(
        `${providerEndpoint}/${providerID}`,
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
