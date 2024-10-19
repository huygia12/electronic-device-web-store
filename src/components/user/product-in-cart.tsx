import { FC, HTMLAttributes } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { applyDiscount, getDiscount } from "@/utils/helpers";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/types/model";

const columnHeaders = [
  "STT",
  "Ảnh",
  "Sản Phẩm",
  "Số lượng",
  "Giá",
  "Giảm Giá",
  "Thành Tiền",
];

interface ProductInCartProps extends HTMLAttributes<HTMLDivElement> {
  cartItems?: CartItem[];
}

const ProductInCart: FC<ProductInCartProps> = ({ ...props }) => {
  if (!props.cartItems || props.cartItems?.length === 0) return;

  return (
    <Card className={cn("rounded-lg shadow-lg", props.className)}>
      <CardContent className="flex flex-col p-4">
        <label htmlFor="product-list" className="text-xl font-semibold"></label>
        <ScrollArea
          id="product-list"
          className="w-full max-h-[30rem] mt-4 rounded-md border-slate-200 border-b-2"
        >
          <Table>
            <TableHeader className="z-10 sticky top-0 border-b-2 bg-white shadow-lg">
              <tr>
                {columnHeaders.map((title, index) => {
                  return (
                    <TableHead
                      className=" text-center text-black font-extrabold text-[1rem]"
                      key={index}
                    >
                      {title}
                    </TableHead>
                  );
                })}
              </tr>
            </TableHeader>
            <TableBody>
              {props.cartItems.map((product, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="text-center text-base">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      <img
                        src={product.thump}
                        alt={product.productID}
                        className="max-h-20 mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center text-base max-w-[15rem] truncate">
                      {product.productName}
                      <br />
                      {`${product.storage} | ${product.color}`}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {product.quantity}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {product.price.toLocaleString() + "đ"}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {getDiscount(product.discount) + "%"}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {applyDiscount(
                        product.price,
                        product.discount
                      ).toLocaleString() + "đ"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProductInCart;
