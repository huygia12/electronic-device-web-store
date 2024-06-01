import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BriefOrderAttributes } from "@/declare";
import { HTMLAttributes } from "react";
import { Button } from "./ui/button";
import { Check, Eye, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrderTableProps extends HTMLAttributes<HTMLDivElement> {
  orders: BriefOrderAttributes[];
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
    <div className={cn("overflow-auto relative max-h-[70vh]", className)}>
      <Table>
        <TableHeader className="border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
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
          {/* <ScrollArea className="max-h-[10vh]"> */}
          {props.orders.map((invoice, index) => (
            <TableRow key={index}>
              <TableCell className="text-center text-base">
                {invoice.customer}
              </TableCell>
              <TableCell className="text-center  text-base">
                {invoice.id}
              </TableCell>
              <TableCell className="text-center text-base">
                {invoice.createdAt.toLocaleTimeString() +
                  " " +
                  invoice.createdAt.toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center text-base">{`${invoice.products} sản phẩm`}</TableCell>
              <TableCell className="text-center text-base">{`${invoice.total.toLocaleString()}đ`}</TableCell>
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
          {/* </ScrollArea> */}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
