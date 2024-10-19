import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { invoiceService } from "@/services";
import { InvoiceStatus } from "@/types/enum";
import { FC, HTMLAttributes, useState } from "react";
import { buttonVariants } from "@/utils/constants";

interface ChangeOrderStatusProps extends HTMLAttributes<HTMLDivElement> {
  invoiceID: string;
  invoiceState: InvoiceStatus;
  setInvoiceState: (invoiceState: InvoiceStatus) => void;
}

const ChangeOrderStatus: FC<ChangeOrderStatusProps> = ({ ...props }) => {
  const [pendingValue, setPendingValue] = useState<InvoiceStatus>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelect = (status: InvoiceStatus) => {
    setPendingValue(status);
    setIsDialogOpen(true);
  };

  const confirmSelection = () => {
    props.setInvoiceState(pendingValue!);
  };

  const cancelSelection = () => {
    setPendingValue(undefined);
    setIsDialogOpen(false);
  };

  return (
    <div className={props.className}>
      <label htmlFor="shipping-status" className="text-xl font-semibold">
        Thay Đổi Trạng Thái Đơn Hàng
      </label>
      <Select value={props.invoiceState} onValueChange={handleSelect}>
        <SelectTrigger
          id="shipping-status"
          className="border-2 mt-2 border-stone-400 text-lg min-h-12 w-[20rem] focus_ring-offset-white focus_ring-white"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            disabled={invoiceService.getAdminInvoiceStatusDisabled(
              InvoiceStatus.NEW,
              props.invoiceState
            )}
            value={InvoiceStatus.NEW}
          >
            Đang Chờ Duyệt
          </SelectItem>
          <SelectItem
            disabled={invoiceService.getAdminInvoiceStatusDisabled(
              InvoiceStatus.PAYMENT_WAITING,
              props.invoiceState
            )}
            value={InvoiceStatus.PAYMENT_WAITING}
          >
            Duyệt Đơn Hàng
          </SelectItem>
          <SelectItem
            disabled={invoiceService.getAdminInvoiceStatusDisabled(
              InvoiceStatus.SHIPPING,
              props.invoiceState
            )}
            value={InvoiceStatus.SHIPPING}
          >
            Đang Vận Chuyển
          </SelectItem>
          <SelectItem
            disabled={invoiceService.getAdminInvoiceStatusDisabled(
              InvoiceStatus.DONE,
              props.invoiceState
            )}
            value={InvoiceStatus.DONE}
          >
            Giao Hàng Thành Công
          </SelectItem>
          <SelectItem
            disabled={invoiceService.getAdminInvoiceStatusDisabled(
              InvoiceStatus.ABORT,
              props.invoiceState
            )}
            value={InvoiceStatus.ABORT}
          >
            Đã Hủy
          </SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{`Chuyển trạng thái đơn hàng từ "${invoiceService.getInvoiceStatus(props.invoiceState)}" sang "${invoiceService.getInvoiceStatus(pendingValue!)}"`}</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động sẽ trực tiếp thay đổi trạng thái đơn hàng và không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={confirmSelection}
              className={buttonVariants({
                variant: "positive",
              })}
            >
              Xác Nhận
            </AlertDialogAction>
            <AlertDialogCancel className="mt-0" onClick={cancelSelection}>
              Hủy
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChangeOrderStatus;
