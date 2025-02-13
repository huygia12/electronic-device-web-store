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

const headers = [
  { title: "STT" },
  { title: "ẢNH SP" },
  { title: "TÊN SP" },
  { title: "(DÀI/RỘNG/CAO)", css: "hidden 2xl_table-cell" },
  { title: "KHỐI LƯỢNG", css: "hidden 3xl_table-cell" },
  { title: "DANH MỤC" },
  { title: "NHÀ SẢN XUẤT" },
  { title: "BẢO HÀNH" },
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
    <Card className={cn("rounded-md shadow-lg w-full", props.className)}>
      <CardContent className="flex flex-col p-0 h-[60vh] min-h-fit xs_p-4 xs_pt-0 w-full">
        {props.products.length !== 0 ? (
          <ScrollArea className="relative pb-3 h-[60vh] w-full">
            <Table>
              <TableHeader className="z-10 border-b-secondary-foreground shadow-lg bg-white border-b-2 sticky top-0">
                <tr className="text-nowrap text-black text-xs md_text-base">
                  {headers.map((header, index) => {
                    return (
                      <TableHead
                        key={index}
                        className={cn("text-center font-extrabold", header.css)}
                      >
                        {header.title}
                      </TableHead>
                    );
                  })}
                </tr>
              </TableHeader>
              <TableBody>
                {props.products.map((product, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      "cursor-pointer text-sm md_text-base",
                      props.selectedProduct?.productID === product.productID &&
                        "bg-theme-softer"
                    )}
                    onClick={() => props.setSelectedProduct(product)}
                  >
                    <TableCell className="text-center">
                      {(props.currentPage - 1) * props.limitPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <img
                        src={product.productItems[0].thump}
                        alt={product.productName}
                        className="w-12 h-12 mx-auto rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip delayDuration={500}>
                          <TooltipTrigger>
                            <div className="max-w-52 md_max-w-72 truncate">
                              {product.productName}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{product.productName}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center hidden 2xl_table-cell">
                      {`${product.length}cm/${product.width}cm/${product.height}cm`}
                    </TableCell>
                    <TableCell className="text-center hidden 3xl_table-cell">
                      {`${product.weight}gram`}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.category.categoryName}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.provider.providerName}
                    </TableCell>
                    <TableCell className="text-center">
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
            <img width={400} src="/empty-box.svg" alt="emptyCart" />
            <span className="text-center text-base md_text-xl font-medium text-slate-500 mb-10">
              Bạn chưa có sản phẩm nào!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductTable;
