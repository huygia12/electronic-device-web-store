import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceFullJoin } from "@/types/api";
import { HTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Check, Eye, X } from "lucide-react";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import invoiceService from "@/utils/invoice";

interface OrderTableProps extends HTMLAttributes<HTMLDivElement> {
  orders: InvoiceFullJoin[];
}

const colName: string[] = [
  "KHÁCH HÀNG",
  "ID ĐƠN HÀNG",
  "NGÀY ĐẶT HÀNG",
  "SỐ LOẠI HÀNG",
  "TỔNG TIỀN",
  "TRẠNG THÁI",
  "THAO TÁC",
];

const OrderTable: React.FC<OrderTableProps> = ({ className, ...props }) => {
  return (
    <ScrollArea className={cn("relative max-h-[70vh]", className)}>
      <Table>
        <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
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
          {props.orders.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell className="text-center text-base">
                {invoice.userName}
              </TableCell>
              <TableCell className="text-center  text-base">
                {invoice.invoiceID}
              </TableCell>
              <TableCell className="text-center text-base">
                {`${invoice.createdAt}`}
              </TableCell>
              <TableCell className="text-center text-base">{`${invoice.invoiceProducts.length} sản phẩm`}</TableCell>
              <TableCell className="text-center text-base">{`${invoiceService.getTotalBill(invoice)}đ`}</TableCell>
              <TableCell className="text-center">
                <Badge className="bg-blue-500 text-white hover_bg-blue-500">
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="flex items-center justify-center space-x-2">
                <Button variant="neutral">
                  <Eye />
                </Button>
                <Button variant="positive">
                  <Check />
                </Button>
                <Button variant="negative">
                  <X />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default OrderTable;
