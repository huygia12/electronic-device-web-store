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
import { Check, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <Table>
      <TableHeader className="border-b-secondary border-b-2">
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
              <Badge className="bg-blue-500 text-white">{invoice.status}</Badge>
            </TableCell>
            <TableCell
              colSpan={3}
              className="flex items-center justify-center space-x-2"
            >
              <Button variant="neutral">
                <Eye />
              </Button>
              <Button variant="positive">
                <Check />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderTable;
