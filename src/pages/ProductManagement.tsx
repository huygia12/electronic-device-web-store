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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/declare";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { NavLink, useRouteLoaderData } from "react-router-dom";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

const colName: string[] = [
  "STT",
  "TÊN SẢN PHẨM",
  "ID",
  "KÍCH THƯỚC(dài/rộng/cao)",
  "KHỐI LƯỢNG",
  "LOẠI SẢN PHẨM",
  "KHOẢNG GIÁ",
  "KHOẢNG GIẢM GIÁ",
  "BẢO HÀNH",
  "THAO TÁC",
];
const ProductManagement = () => {
  const productsData = useRouteLoaderData("product_management") as Product[];

  const getPriceRange = (product: Product): string => {
    const len = product.items.length;
    if (len === 0) {
      /** Doesnt have any items */
      return "";
    } else if (len === 1) {
      /** Have only one item */
      return product.items[0].price.toLocaleString();
    }

    /** Find and return the range*/
    let min: number = product.items[0].price;
    let max: number = product.items[0].price;
    product.items.forEach((item) => {
      if (item.price < min) {
        min = item.price;
      }
      if (item.price > max) {
        max = item.price;
      }
    });

    if (min == max) {
      return min.toLocaleString();
    }

    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const getSaleRange = (product: Product): string => {
    const len = product.items.length;
    if (len === 0) {
      /** Doesnt have any items */
      return "";
    } else if (len === 1) {
      /** Have only one item */
      return String(product.items[0].discount);
    }

    /** Find and return the range*/
    let min: number = product.items[0].discount ?? 0;
    let max: number = product.items[0].discount ?? 0;
    product.items.forEach((item) => {
      if (!item.discount) return;
      if (item.discount < min) {
        min = item.discount;
      }
      if (max && item.discount > max) {
        max = item.discount;
      }
    });

    if (min == max) {
      return String(min);
    }

    return `${min}-${max}`;
  };

  return (
    <>
      {/** Add and search */}
      <Card className="rounded-2xl shadow-lg my-8">
        <CardContent className="flex justify-between p-6">
          <NavLink to="/admin/managed-products/add">
            <Button variant="positive" className="text-xl">
              Thêm sản phẩm mới
              <Plus />
            </Button>
          </NavLink>
          <div className="relative my-auto h-[2.5rem]">
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
          <CardTitle className="text-8">Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col px-6 pb-4">
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
                {productsData?.map((product, index) => (
                  <TableRow key={index}>
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
                          <TooltipContent>{product.productName}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {product.id}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {`${product.len}cm/${product.width}cm/${product.height}cm`}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {`${product.weight}gram`}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {product.categoryName}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {`${getPriceRange(product)}đ`}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {`${getSaleRange(product)}%`}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {`${product.gurantee} tháng`}
                    </TableCell>
                    <TableCell className="flex items-center justify-center space-x-2">
                      <Button variant="neutral">
                        <SquarePen />
                      </Button>
                      <Button variant="negative">
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

export { ProductManagement };
