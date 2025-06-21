import { FC, HTMLAttributes } from "react";
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
import { NavLink } from "react-router-dom";

const columnHeaders = [
  { title: "STT", css: "hidden sms_table-cell" },
  { title: "Ảnh" },
  { title: "Sản Phẩm" },
  { title: "SL", css: "hidden xss_table-cell" },
  { title: "Giá", css: "hidden lgg_table-cell" },
  { title: "Giảm Giá", css: "hidden md_table-cell" },
  { title: "Thành Tiền" },
];

interface ProductInCartProps extends HTMLAttributes<HTMLDivElement> {
  cartItems?: CartItem[];
}

const ProductInCart: FC<ProductInCartProps> = ({ ...props }) => {
  if (!props.cartItems || props.cartItems?.length === 0) return;

  return (
    <Card className={cn("rounded-lg shadow-lg", props.className)}>
      <CardContent className="flex flex-col px-0 sm_px-4">
        <Table className="rounded-md border-slate-200 border-b-2">
          <TableHeader className="z-10 sticky top-0 border-b-2 bg-white shadow-lg">
            <tr className="text-nowrap text-black text-sm md_text-base">
              {columnHeaders.map((header, index) => {
                return (
                  <TableHead
                    className={cn("text-center font-extrabold", header.css)}
                    key={index}
                  >
                    {header.title}
                  </TableHead>
                );
              })}
            </tr>
          </TableHeader>
          <TableBody>
            {props.cartItems.map((product, index) => {
              return (
                <TableRow key={index} className="text-sm md_text-base">
                  <TableCell className="text-center hidden sms_table-cell">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    <img
                      src={product.thump}
                      alt={product.productID}
                      className="max-h-20 mx-auto"
                    />
                  </TableCell>

                  <TableCell className="text-center hover_underline hover_text-primary-foreground cursor-pointer">
                    <NavLink
                      to={"/products/" + product.productID}
                      target="_blank"
                      unstable_viewTransition
                      className="flex flex-col items-center"
                    >
                      <div className="line-clamp-1 w-[10rem] sm_w-[12rem] md_w-[15rem]">
                        {product.productName}
                      </div>
                      {`${product.storage} | ${product.color}`}
                      <div className="block xss_hidden">{`SL: ${product.quantity}`}</div>
                    </NavLink>
                  </TableCell>
                  <TableCell className="text-center hidden xss_table-cell">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-center hidden lgg_table-cell">
                    {product.price.toLocaleString() + "đ"}
                  </TableCell>
                  <TableCell className="text-center hidden md_table-cell">
                    {getDiscount(product.discount) + "%"}
                  </TableCell>
                  <TableCell className="text-center">
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
      </CardContent>
    </Card>
  );
};

export default ProductInCart;
