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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";

interface ProductDeletionDialogProps extends HTMLAttributes<HTMLDivElement> {
  onDeepCleanCheck: (check: CheckedState) => void;
  onDeleteAccept: () => void;
}

const ProductDeletionDialog: FC<ProductDeletionDialogProps> = ({
  ...props
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="negative">
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này sẽ trực tiếp xóa sản phẩm và không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="items-top flex space-x-2">
          <Checkbox
            id="deep-clean-checkbox"
            className="!text-white"
            onCheckedChange={props.onDeepCleanCheck}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="deep-clean-checkbox"
              className="text-sm font-medium leading-none peer-disabled_cursor-not-allowed peer-disabled_opacity-70"
            >
              Dọn dẹp sâu
            </label>
            <p className="text-sm text-muted-foreground">
              lịch sử giao dịch sẽ không hiển thị được ảnh sản phẩm nữa.
            </p>
          </div>
        </div>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogAction
            onClick={props.onDeleteAccept}
            className={buttonVariants({
              variant: "negative",
            })}
          >
            Xóa
          </AlertDialogAction>
          <AlertDialogCancel className="mt-0">Hủy</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProductDeletionDialog;
