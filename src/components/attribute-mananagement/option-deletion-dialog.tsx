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
import { FC, HTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { buttonVariants } from "@/utils/constants";

interface OptionDeletionDialogProps extends HTMLAttributes<HTMLDivElement> {
  onDeletionAccept: () => void;
}

const OptionDeletionDialog: FC<OptionDeletionDialogProps> = ({ ...props }) => {
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
            Hành động này sẽ trực tiếp xóa giá trị của thuộc tính và không thể
            hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogAction
            onClick={props.onDeletionAccept}
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

export default OptionDeletionDialog;
