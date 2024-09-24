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
import { FC, useState } from "react";
import { buttonVariants } from "@/utils/constants";
import { arrayInReverse } from "@/utils/helpers";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { productService } from "@/services";
import { Checkbox } from "@/components/ui/checkbox";

const colName: string[] = [
  "STT",
  "ẢNH SẢN PHẨM",
  "TÊN SẢN PHẨM",
  "KÍCH THƯỚC(dài/rộng/cao)",
  "KHỐI LƯỢNG",
  "DANH MỤC",
  "NHÀ PHÂN PHỐI",
  "BẢO HÀNH",
];

const ProductManagement: FC = () => {
  const productsData = useRouteLoaderData(
    "product_management"
  ) as ProductSummary[];
  const [productsSummary, setProductsSummary] =
    useState<ProductSummary[]>(productsData);
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary>();
  const [searchingInput, setSearchingInput] = useState("");
  const [deepCleanProductID, setDeepCleanProductID] = useState<string>();

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    const response = productService.apis.deleteProduct(
      selectedProduct.productID,
      deepCleanProductID === selectedProduct.productID
    );
    toast.promise(response, {
      loading: "Đang xử lý...",
      success: () => {
        setProductsSummary(
          productsSummary.filter(
            (product) => product.productID !== selectedProduct.productID
          )
        );
        setSelectedProduct(undefined);
        setDeepCleanProductID(undefined);
        return "Xóa thành công!";
      },
      error: "Xóa thất bại!",
    });
  };

  return (
    <>
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
            {productsSummary.length !== 0 ? (
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
                    {arrayInReverse(productsSummary)
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
                          <TableCell>
                            <img
                              src={product.productItems[0].thump}
                              alt={product.productName}
                              className="w-12 h-12 mx-auto rounded-md object-cover"
                            />
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
                            {product.category.categoryName}
                          </TableCell>
                          <TableCell className="text-center text-base">
                            {product.provider.providerName}
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
                    <div className="items-top flex space-x-2">
                      <Checkbox
                        id="deep-clean-checkbox"
                        className="!text-white"
                        onClick={() =>
                          setDeepCleanProductID(selectedProduct.productID)
                        }
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="deep-clean-checkbox"
                          className="text-sm font-medium leading-none peer-disabled_cursor-not-allowed peer-disabled_opacity-70"
                        >
                          Dọn dẹp sâu
                        </label>
                        <p className="text-sm text-muted-foreground">
                          lịch sử giao dịch sẽ không hiển thị được ảnh sản phẩm
                          nữa.
                        </p>
                      </div>
                    </div>
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
    </>
  );
};

export default ProductManagement;
