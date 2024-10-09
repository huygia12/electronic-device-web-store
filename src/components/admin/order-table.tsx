import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceFullJoin } from "@/types/model";
import { HTMLAttributes } from "react";
import { Button } from "../ui/button";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { invoiceService } from "@/services";
import { formatDateTime } from "@/utils/helpers";
import OrderDetailDialog from "./order-detail-dialog";

interface OrderTableProps extends HTMLAttributes<HTMLDivElement> {
  orders: InvoiceFullJoin[];
}

const colName: string[] = [
  "KHÁCH HÀNG",
  "ID ĐƠN HÀNG",
  "NGÀY ĐẶT HÀNG",
  "SỐ MẶT HÀNG",
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
              <TableCell className="text-center text-base">
                {invoice.invoiceID}
              </TableCell>
              <TableCell className="text-center text-base">
                {formatDateTime(`${invoice.createdAt}`)}
              </TableCell>
              <TableCell className="text-center text-base">{`${invoice.invoiceProducts.length} sản phẩm`}</TableCell>
              <TableCell className="text-center text-base">{`${invoiceService.getTotalBill(invoice).toLocaleString()}đ`}</TableCell>
              <TableCell className="text-center">
                <Badge className="bg-green-500 text-white py-2 px-4 text-sm hover_bg-green-500">
                  {invoiceService.getInvoiceStatus(invoice.status)}
                </Badge>
              </TableCell>
              <TableCell className="flex items-center justify-center space-x-2">
                <OrderDetailDialog invoice={invoice}>
                  <Button variant="neutral" className="text-base">
                    Xem
                  </Button>
                </OrderDetailDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default OrderTable;
