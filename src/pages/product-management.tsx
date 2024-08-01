import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductSummary } from "@/types/api";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { NavLink, useRouteLoaderData } from "react-router-dom";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { buttonVariants } from "@/utils/constants";
import { arrayInReverse } from "@/utils/helpers";
import { Separator } from "@/components/ui/separator";
import { axiosInstance, reqConfig } from "@/services/axios";
import { useCurrentUser } from "@/hooks";
import { toast } from "sonner";
import axios from "axios";
import { clearImagesInFB } from "@/utils/product";
import { getProducts } from "@/services/apis";

const colName: string[] = [
  "STT",
  "TÊN SẢN PHẨM",
  "KÍCH THƯỚC(dài/rộng/cao)",
  "KHỐI LƯỢNG",
  "DANH MỤC",
  "NHÀ PHÂN PHỐI",
  "BẢO HÀNH",
];

const ProductManagement = () => {
  const productsData = useRouteLoaderData(
    "product_management"
  ) as ProductSummary[];
  const [productSummaryList, setProductSummaryList] = useState<
    ProductSummary[] | undefined
  >(productsData);
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary>();
  const [searchingInput, setSearchingInput] = useState("");
  const { currUser } = useCurrentUser();

  const handleDeleteProduct = async () => {
    try {
      const res = await axiosInstance.delete<{ info: string[] }>(
        `/products/${selectedProduct?.productID}`,
        {
          headers: {
            "User-id": currUser?.userID,
          },
          ...reqConfig,
        }
      );
      const productSummaryList: ProductSummary[] | undefined =
        await getProducts();

      clearImagesInFB(res.data.info);
      setProductSummaryList(productSummaryList);
      setSelectedProduct(undefined);
      toast.success("Thay đổi thành công!");
    } catch (error) {
      toast.error("Thay đổi thất bại!");
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(`Response data: ${error.response.data}`);
          console.error(`Response status: ${error.response.status})`);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <section>
      {/**Search */}
      <div className="relative h-[3rem] mt-8 mb-4">
        <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          className="h-full text-lg w-full rounded-xl bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0"
          onChange={(e) => setSearchingInput(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        {/** Table */}
        <Card className="rounded-2xl shadow-lg flex-1">
          <CardContent className="flex flex-col p-4">
            {productSummaryList && productSummaryList.length !== 0 ? (
              <ScrollArea className="relative h-[58vh]">
                <Table>
                  <TableHeader className="z-10 border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
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
                    {arrayInReverse(productSummaryList)
                      .filter((product) =>
                        product.productName
                          .toLowerCase()
                          .includes(searchingInput.toLowerCase())
                      )
                      .map((product, index) => (
                        <TableRow
                          key={index}
                          className={
                            selectedProduct &&
                            (product.productID === selectedProduct.productID
                              ? "bg-theme-softer"
                              : "")
                          }
                          onClick={() => setSelectedProduct(product)}
                        >
                          <TableCell className="text-center text-base">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="max-w-80 truncate">
                                    {product.productName}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {product.productName}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {`${product.length}cm/${product.width}cm/${product.height}cm`}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {`${product.weight}gram`}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {product.categoryName}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {product.providerName}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {`${product.warranty} tháng`}
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
                  Bạn chưa có sản phẩm nào!
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardContent className="p-4 space-y-4 flex flex-col contain-content">
            <NavLink to="/admin/products/add" unstable_viewTransition>
              <Button variant="positive">
                <Plus />
              </Button>
            </NavLink>
            {selectedProduct ? (
              <>
                <NavLink
                  to={`/admin/products/${selectedProduct.productID}`}
                  unstable_viewTransition
                >
                  <Button variant="neutral">
                    <SquarePen />
                  </Button>
                </NavLink>
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
                        Hành động này sẽ trực tiếp xóa sản phẩm và không thể
                        hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={() => handleDeleteProduct()}
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

      {/** Pagination */}
      {/* <Pagination>
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
      </Pagination> */}
    </section>
  );
};

export default ProductManagement;
