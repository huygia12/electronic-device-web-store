import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Provider } from "@/types/api";
import axios, { HttpStatusCode } from "axios";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { arrayInReverse } from "@/utils/helpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/utils/constants";
import { Separator } from "@radix-ui/react-select";
import { providerApis } from "@/services/apis";
import { ProviderDialog } from "@/components/admin";

const colName: string[] = [
  "STT",
  "MÃ NHÀ PHÂN PHỐI",
  "TÊN NHÀ PHÂN PHỐI",
  "SỐ SẢN PHẨM",
];

const ProviderManagement = () => {
  const providersData = useRouteLoaderData("provider_management") as Provider[];
  const [providers, setProviders] = useState<Provider[]>(providersData);
  const [selectedProvider, setSelectedProvider] = useState<Provider>();
  const [searchingInput, setSearchingInput] = useState("");

  const handleAddProvider = async (name: string) => {
    const processedName: string = name.trim();
    try {
      await providerApis.addProvider(processedName);
      const fetchedProviders: Provider[] = await providerApis.getProviders();
      setProviders(fetchedProviders);
      toast.success("Thêm thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thêm thất bại: nhà cung cấp này đã tồn tại!");
          return;
        }
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
      toast.error("Thêm thất bại!");
    }
  };

  const handleUpdateProvider = async (name: string) => {
    if (!selectedProvider) return;
    const processedName: string = name.trim();
    try {
      await providerApis.updateProvider(
        selectedProvider.providerID,
        processedName
      );
      const fetchedProviders: Provider[] = await providerApis.getProviders();
      setProviders(fetchedProviders);
      setSelectedProvider(undefined);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thay đổi thất bại: nhà cung cấp này đã tồn tại!");
          return;
        }
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
      toast.error("Thay đổi thất bại!");
    }
  };

  const handleDeleteProvider = async () => {
    if (!selectedProvider) return;
    try {
      await providerApis.deleteProvider(selectedProvider.providerID);
      const fetchedProviders: Provider[] = await providerApis.getProviders();
      setProviders(fetchedProviders);
      setSelectedProvider(undefined);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == HttpStatusCode.Conflict) {
          toast.error("Thay đổi thất bại: tồn tại sản phẩm liên quan!");
          return;
        }
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
      toast.error("Thay đổi thất bại!");
    }
  };

  return (
    <section>
      <div className="relative h-[3rem] mt-8 mb-4">
        <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          className="h-full text-lg w-full rounded-xl bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0"
          onChange={(e) => setSearchingInput(e.target.value)}
        />
      </div>

      {/** Table */}
      <div className="flex gap-4">
        <Card className="rounded-xl shadow-lg flex-1">
          <CardContent className="flex flex-col p-4">
            {providers.length !== 0 ? (
              <ScrollArea className="relative h-[58vh]">
                <Table>
                  <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white">
                    <tr>
                      {colName.map((item, key) => {
                        return (
                          <TableHead
                            key={key}
                            className=" text-center text-black font-extrabold text-[1rem]"
                          >
                            {item}
                          </TableHead>
                        );
                      })}
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {arrayInReverse(providers)
                      .filter((provider) =>
                        provider.providerName
                          .toLowerCase()
                          .includes(searchingInput.toLowerCase())
                      )
                      .map((provider, index) => (
                        <TableRow
                          key={index}
                          className={
                            selectedProvider &&
                            (provider.providerID === selectedProvider.providerID
                              ? "bg-theme-softer"
                              : "")
                          }
                          onClick={() => setSelectedProvider(provider)}
                        >
                          <TableCell className="text-center text-base">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {provider.providerID}
                          </TableCell>
                          <TableCell className="text-center  text-base">
                            {provider.providerName}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {provider.productQuantity || "0"}
                          </TableCell>
                        </TableRow>
                      ))}
                    <tr>
                      <td>
                        <Separator />
                      </td>
                    </tr>
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center">
                <img width={500} src="/empty-box.svg" alt="emptyCart" />
                <span className="text-xl font-medium text-slate-500 mb-10">
                  Bạn chưa có nhà cung cấp nào!
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-4 space-y-4 contain-content">
            <ProviderDialog
              formTitle="Thêm nhà phân phối mới"
              handleDialogAcceptEvent={handleAddProvider}
            >
              <Button className="" variant="positive">
                <Plus />
              </Button>
            </ProviderDialog>
            {selectedProvider ? (
              <>
                <ProviderDialog
                  formTitle="Sửa thông tin nhà phân phối"
                  provider={selectedProvider}
                  handleDialogAcceptEvent={handleUpdateProvider}
                >
                  <Button variant="neutral">
                    <SquarePen />
                  </Button>
                </ProviderDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="negative">
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn muốn xóa?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này sẽ trực tiếp xóa nhà phân phối và không
                        thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={() => handleDeleteProvider()}
                        className={buttonVariants({
                          variant: "negative",
                        })}
                      >
                        Xóa
                      </AlertDialogAction>
                      <AlertDialogCancel className="mt-0">
                        Hủy
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <>
                <SquarePen className="mx-4 !mt-6" />
                <Trash2 className="mx-4 !mt-6" />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProviderManagement;
