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
import { buttonVariants } from "@/utils/constants";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { FC, HTMLAttributes } from "react";

interface OrderCancelDialogProps extends HTMLAttributes<HTMLDivElement> {
  handleConfirm: () => void;
}

const OrderCancelDialog: FC<OrderCancelDialogProps> = ({ ...props }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Hủy đơn hàng`}</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động sẽ trực tiếp hủy đơn hàng và không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={props.handleConfirm}
            className={buttonVariants({
              variant: "negative",
            })}
          >
            Xác Nhận
          </AlertDialogAction>
          <AlertDialogCancel className="mt-0">Hủy</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderCancelDialog;
