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
import log from "loglevel";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";

log.setLevel("error");

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
    const len = product.productItem.length;
    if (len === 0) {
      log.warn("Product doesn't have any items!");
      return "";
    } else if (len === 1) {
      return product.productItem[0].price.toLocaleString();
    }

    let min: number = product.productItem[0].price;
    let max: number = product.productItem[0].price;
    product.productItem.forEach((item) => {
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
    const len = product.productItem.length;
    if (len === 0) {
      log.warn("Product doesn't have any items!");
      return "";
    } else if (len === 1) {
      return String(product.productItem[0].discount);
    }

    let min: number = product.productItem[0].discount;
    let max: number = product.productItem[0].discount;
    product.productItem.forEach((item) => {
      if (item.discount < min) {
        min = item.discount;
      }
      if (item.discount > max) {
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
          <div className="overflow-auto relative h-[58vh]">
            <Table>
              <TableHeader className="border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
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
                      {index}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="max-w-80 truncate">
                              {product.name}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{product.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {product.id}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {`${product.length}cm/${product.width}cm/${product.height}cm`}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {`${product.weight}gram`}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {product.category}
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
          </div>
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
