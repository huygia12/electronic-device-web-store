import { ProviderDialog } from "@/components/providerDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Provider } from "@/declare";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

const colName: string[] = [
  "STT",
  "TÊN NHÀ PHÂN PHỐI",
  "MÃ NHÀ PHÂN PHỐI",
  "SỐ SẢN PHẨM",
  "THAO TÁC",
];

const ProviderManagement = () => {
  const providersData = useRouteLoaderData("provider_management") as Provider[];
  const [existingproviders, setExistingProvider] = useState(providersData);

  const deleteProvider = (providerID: string) => {
    const temp = existingproviders.filter(
      (provider) => provider.providerID !== providerID
    );
    setExistingProvider(temp);
  };

  return (
    <>
      <Card className="rounded-2xl shadow-lg my-8">
        <CardContent className="flex justify-between p-6">
          <ProviderDialog formTitle="Thêm nhà phân phối mới">
            <Button variant="positive" className="text-xl">
              Thêm nhà phân phối mới
              <Plus />
            </Button>
          </ProviderDialog>
          <div className="relative flex-1 md_grow-0 h-[2.5rem]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="h-full text-xl w-full rounded-lg bg-background pl-8 md_w-[200px] lg_w-[336px]"
            />
          </div>
        </CardContent>
      </Card>

      {/** Table */}
      <Card className="rounded-2xl shadow-lg mb-4">
        <CardHeader className="py-6 px-10">
          <CardTitle className="text-8">Danh sách các nhà phân phối</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col px-6 pb-4">
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
                {existingproviders.map((provider, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center text-base">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center  text-base">
                      {provider.providerName}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {provider.providerID}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {provider.products}
                    </TableCell>
                    <TableCell className="flex items-center justify-center space-x-2">
                      <ProviderDialog
                        formTitle="Sửa thông tin nhà phân phối"
                        provider={provider}
                      >
                        <Button variant="neutral">
                          <SquarePen />
                        </Button>
                      </ProviderDialog>
                      <Button
                        variant="negative"
                        onClick={() => deleteProvider(provider.providerID)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/** Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default ProviderManagement;
