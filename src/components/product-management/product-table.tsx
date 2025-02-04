import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FC, HTMLAttributes } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductSummary } from "@/types/payload";
import { cn } from "@/lib/utils";

const columnHeaders = [
  "STT",
  "ẢNH SẢN PHẨM",
  "TÊN SẢN PHẨM",
  "(DÀI/RỘNG/CAO)",
  "KHỐI LƯỢNG",
  "DANH MỤC",
  "NHÀ PHÂN PHỐI",
  "BẢO HÀNH",
];

interface ProductTableProps extends HTMLAttributes<HTMLDivElement> {
  products: ProductSummary[];
  selectedProduct?: ProductSummary;
  setSelectedProduct: (product: ProductSummary) => void;
  currentPage: number;
  limitPerPage: number;
}

const ProductTable: FC<ProductTableProps> = ({ ...props }) => {
  return (
    <Card className={cn("rounded-2xl shadow-lg", props.className)}>
      <CardContent className="flex flex-col p-4 h-[60vh] min-h-fit">
        {props.products.length !== 0 ? (
          <ScrollArea className="relative pr-3 pb-3 h-[60vh]">
            <Table>
              <TableHeader className="z-10 border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
                <tr>
                  {columnHeaders.map((item, key) => {
                    return (
                      <TableHead
                        key={key}
                        className="text-nowrap text-center text-black font-extrabold text-[1rem]"
                      >
                        {item}
                      </TableHead>
                    );
                  })}
                </tr>
              </TableHeader>
              <TableBody className="">
                {props.products.map((product, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      "cursor-pointer",
                      props.selectedProduct?.productID === product.productID &&
                        "bg-theme-softer"
                    )}
                    onClick={() => props.setSelectedProduct(product)}
                  >
                    <TableCell className="text-center text-base">
                      {(props.currentPage - 1) * props.limitPerPage + index + 1}
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
                          <TooltipContent>{product.productName}</TooltipContent>
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
            <ScrollBar orientation="horizontal" />
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
  );
};

export default ProductTable;
