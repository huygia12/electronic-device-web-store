import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types/model";
import { FC, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { invoiceService } from "@/services";
import { formatDateTime, getInvoiceStatus } from "@/utils/helpers";
import InvoiceDetailDialog from "./invoice-detail-dialog";
import { Separator } from "@/components/ui/separator";
import TableContextMenu from "../common/table-context-menu";

const columnHeaders = [
  "TÊN ĐẶT HÀNG",
  "ID ĐƠN HÀNG",
  "NGÀY ĐẶT",
  "TỔNG TIỀN",
  "TRẠNG THÁI",
  "THAO TÁC",
];

interface OrderTableProps extends HTMLAttributes<HTMLDivElement> {
  invoices: Invoice[];
  setInvoices: (invoice: Invoice[]) => void;
}

const InvoiceTable: FC<OrderTableProps> = ({ className, ...props }) => {
  const updateInvoice = async (invoice: Invoice) => {
    props.setInvoices(
      invoiceService.deleteInvoice(invoice.invoiceID, props.invoices)
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
        <TableBody>
          {props.invoices.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell
                className="text-center text-base
              "
              >
                {invoice.userName}
              </TableCell>
              <TableCell className="text-center text-base">
                <TableContextMenu textToCopy={invoice.invoiceID}>
                  {invoice.invoiceID}
                </TableContextMenu>
              </TableCell>
              <TableCell className="text-center text-base xl_text-nowrap">
                {formatDateTime(`${invoice.createdAt}`)}
              </TableCell>
              <TableCell className="text-center text-base">{`${invoiceService.getTotalBill(invoice).toLocaleString()}đ`}</TableCell>
              <TableCell className="text-center">
                <Badge
                  className={cn(
                    `text-white px-2 text-sm whitespace-normal break-words max-w-[8rem] hover_!${invoiceService.getInvoiceStatusColor(
                      invoice.status
                    )}`,
                    invoiceService.getInvoiceStatusColor(invoice.status)
                  )}
                >
                  {getInvoiceStatus(invoice.status)}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-center">
                <InvoiceDetailDialog
                  invoice={invoice}
                  updateInvoice={updateInvoice}
                >
                  <Button variant="neutral" className="text-base">
                    Xem
                  </Button>
                </InvoiceDetailDialog>
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
  );
};

export default InvoiceTable;
