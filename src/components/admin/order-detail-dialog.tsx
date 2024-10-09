import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HTMLAttributes, useState } from "react";
import { InvoiceFullJoin } from "@/types/model";
import { invoiceService } from "@/services";
import { formatDateTime } from "@/utils/helpers";
import Badge from "../ui/badge";
import { InvoiceStatus } from "@/types/enum";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import ChangeOrderStatus from "./change-order-status";
import ProductInOrder from "./product-in-order";

interface OrderDetailDialogProps extends HTMLAttributes<HTMLDivElement> {
  invoice: InvoiceFullJoin;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  className,
  ...props
}) => {
  const [invoiceState, setInvoiceState] = useState<InvoiceStatus>(
    props.invoice.status
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="min-w-[90rem]">
        <DialogHeader>
          <DialogTitle className="border-b-2 pb-4 border-dashed border-slate-500 flex justify-between">
            <span className="text-3xl font-light">Thông Tin Đơn Hàng</span>
            <span className="mr-4 space-x-4 flex items-center">
              <span>{props.invoice.invoiceID}</span>
              <Badge className="bg-green-500 rounded-md text-white py-1 px-4 text-lg hover_bg-green-500">
                {invoiceService.getInvoiceStatus(props.invoice.status)}
              </Badge>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex mt-4">
          <div className="flex flex-col w-1/2">
            <span className="text-xl font-semibold">Thông Tin Khách Hàng</span>
            <span className="mt-2 ">{props.invoice.userName}</span>
            <span className="mt-1 ">{`${props.invoice.detailAddress}, ${props.invoice.ward}, ${props.invoice.district}, ${props.invoice.province}`}</span>
            <span className="mt-1 ">{props.invoice.email}</span>
            <span className="mt-1 ">{props.invoice.phoneNumber}</span>
          </div>
          <div className="flex flex-col w-1/2 items-end">
            <span className="text-xl font-semibold">
              Phương Thức Thanh Toán
            </span>
            <span>
              {invoiceService.getInvoicePaymentMethod(props.invoice.payment)}
            </span>
            <span className="text-xl mt-3 font-semibold">
              Phương Thức Vận Chuyển
            </span>
            <span>Giao hàng nhanh</span>
            <span className="text-xl mt-3 font-semibold">Ngày Đặt Hàng</span>
            <span>{formatDateTime(`${props.invoice.createdAt}`)}</span>
          </div>
        </div>

        <ChangeOrderStatus
          invoiceState={invoiceState}
          setInvoiceState={setInvoiceState}
          className="mt-10"
        />

        <ProductInOrder
          products={props.invoice.invoiceProducts}
          className="mt-10"
        />

        <div className="flex space-x-2">
          <Button className="ml-auto bg-white !text-green-500 !border-green-500 border-2 text-base hover_!bg-green-500 hover_!text-white">
            <Download className="mr-2" /> Xuất Tệp Excel
          </Button>
          <Button className="ml-auto bg-white !text-red-500 !border-red-500 border-2 text-base hover_!bg-red-500 hover_!text-white">
            <Download className="mr-2" />
            Xuất Tệp PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
