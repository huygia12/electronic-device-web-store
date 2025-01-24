import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types/model";
import { HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { invoiceService } from "@/services";
import { formatDateTime, getInvoiceStatus } from "@/utils/helpers";
import OrderDetailDialog from "./order-detail-dialog";
import { Separator } from "@/components/ui/separator";

const columnHeaders: string[] = [
  "KHÁCH HÀNG",
  "ID ĐƠN HÀNG",
  "NGÀY ĐẶT",
  "SỐ MẶT HÀNG",
  "TỔNG TIỀN",
  "TRẠNG THÁI",
  "THAO TÁC",
];

interface OrderTableProps extends HTMLAttributes<HTMLDivElement> {
  orders: Invoice[];
  setOrders: (invoice: Invoice[]) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ className, ...props }) => {
  const updateInvoice = async (invoice: Invoice) => {
    props.setOrders(
      invoiceService.deleteInvoice(invoice.invoiceID, props.orders)
    );
  };

  return (
    <ScrollArea className={cn("relative", className)}>
      <Table>
        <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
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
        <TableBody className="p-0">
          {props.orders.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell className="text-center text-base">
                {invoice.userName}
              </TableCell>
              <TableCell className="text-center text-base">
                {invoice.invoiceID}
              </TableCell>
              <TableCell className="text-center text-base xl_text-nowrap">
                {formatDateTime(`${invoice.createdAt}`)}
              </TableCell>
              <TableCell className="text-center text-base">{`${invoice.invoiceProducts.length} sản phẩm`}</TableCell>
              <TableCell className="text-center text-base">{`${invoiceService.getTotalBill(invoice).toLocaleString()}đ`}</TableCell>
              <TableCell className="text-center">
                <Badge
                  className={cn(
                    `text-white px-2 text-sm whitespace-normal break-words max-w-[8rem]`,
                    invoiceService.getInvoiceStatusColor(invoice.status)
                  )}
                >
                  {getInvoiceStatus(invoice.status)}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-center">
                <OrderDetailDialog
                  invoice={invoice}
                  updateInvoice={updateInvoice}
                >
                  <Button variant="neutral" className="text-base">
                    Xem
                  </Button>
                </OrderDetailDialog>
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
  );
};

export default OrderTable;
