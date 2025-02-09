import { FC, HTMLAttributes } from "react";
import { User } from "@/types/model";
import { buttonVariants } from "@/utils/constants";
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";

interface UserDeletionProps extends HTMLAttributes<HTMLFormElement> {
  user?: User;
  handleDeleteUser: () => void;
}

const UserDeletionDialog: FC<UserDeletionProps> = ({ className, ...props }) => {
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
            Người dùng sẽ không bị xóa hoàn toàn nhưng hành động này hiện không
            thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogAction
            onClick={props.handleDeleteUser}
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

export default UserDeletionDialog;
