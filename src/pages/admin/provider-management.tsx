import { Provider } from "@/types/model";
import axios, { HttpStatusCode } from "axios";
import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { providerService } from "@/services";
import { ProviderTable, ProviderTools } from "@/components/provider-management";
import { SearchBox } from "@/components/common";

const ProviderManagement = () => {
  const providersData = useRouteLoaderData("provider_management") as Provider[];
  const [providers, setProviders] = useState<Provider[]>(providersData);
  const [selectedProvider, setSelectedProvider] = useState<Provider>();
  const [searchText, setSearchText] = useState("");

  const handleAddProvider = async (value: string) => {
    const addProvider = providerService.apis.addProvider(value.trim());

    toast.promise(addProvider, {
      loading: "Đang xử lý...",
      success: (provider: Provider) => {
        setProviders(providerService.addProvider(provider, providers));
        setSelectedProvider(undefined);
        return "Thêm thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Thêm thất bại: nhà cung cấp này đã tồn tại!";
          }
        }
        return "Thêm thất bại!";
      },
    });
  };

  const handleUpdateProvider = async (value: string) => {
    if (!selectedProvider) return;

    const updateProvider = providerService.apis.updateProvider(
      selectedProvider.providerID,
      value.trim()
    );

    toast.promise(updateProvider, {
      loading: "Đang xử lý...",
      success: (provider: Provider) => {
        setProviders(providerService.updateProvider(provider, providers));
        return "Thay đổi thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Thay đổi thất bại: nhà cung cấp này đã tồn tại!";
          }
        }
        return "Thay đổi thất bại!";
      },
    });
  };

  const handleDeleteProvider = async () => {
    if (!selectedProvider) return;

    const deleteProvider = providerService.apis.deleteProvider(
      selectedProvider.providerID
    );

    toast.promise(deleteProvider, {
      loading: "Đang xử lý...",
      success: () => {
        setProviders(
          providerService.deleteProvider(selectedProvider, providers)
        );
        setSelectedProvider(undefined);
        return "Xóa thành công!";
      },
      error: () => {
        return "Xóa thất bại!";
      },
    });
  };

  return (
    <div className="my-8">
      <SearchBox className="mb-4" setSearchText={setSearchText} />

      {/** Table */}
      <div className="flex gap-4">
        <ProviderTable
          className="flex-1"
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          providers={providerService.getSearchingResult(searchText, providers)}
        />

        <ProviderTools
          selectedProvider={selectedProvider}
          handleAddProvider={handleAddProvider}
          handleUpdateProvider={handleUpdateProvider}
          handleDeleteProvider={handleDeleteProvider}
        />
      </div>
    </div>
  );
};

export default ProviderManagement;
