import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/utils/constants";
import { cn } from "@/lib/utils";
import { useCartProps } from "@/hooks";
import { FC, HTMLAttributes } from "react";

const DeleteAllItemsDialog: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { removeInvoice } = useCartProps();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          "w-full mt-auto",
          buttonVariants({ variant: "negative" })
        )}
      >
        Xóa giỏ hàng
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn muốn dọn giỏ hàng?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ xóa cả giỏ hàng và không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="m-0">Hủy</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "negative" }))}
            onClick={removeInvoice}
          >
            Xác nhân
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllItemsDialog;
