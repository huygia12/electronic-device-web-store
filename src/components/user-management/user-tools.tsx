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
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { buttonVariants } from "@/utils/constants";
import { FC, HTMLAttributes } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User } from "@/types/model";
import UpdateUserDialog from "./update-user-dialog";
import AddUserDialog from "./add-user-dialog";
import { SignupFormProps, UserFormProps } from "@/utils/schema";

interface UserToolsProps extends HTMLAttributes<HTMLDivElement> {
  selectedUser: User | undefined;
  handleDeleteUser: () => void;
  handleUpdateUser: (formProps: UserFormProps, avatarFile?: File) => void;
  handleAddUser: (formProps: SignupFormProps, avatarFile?: File) => void;
}

const UserTools: FC<UserToolsProps> = ({ className, ...props }) => {
  return (
    <Card className={cn("rounded-md shadow-lg", className)}>
      <CardContent className="p-4 contain-content flex items-center flex-row gap-4 md_flex-col">
        {/** add button */}
        <AddUserDialog handleAddUser={props.handleAddUser}>
          <Button variant="positive" className="text-xl">
            <Plus />
          </Button>
        </AddUserDialog>

        {props.selectedUser ? (
          <>
            {/** user updation */}
            <UpdateUserDialog
              user={props.selectedUser}
              handleUpdateUser={props.handleUpdateUser}
            >
              <Button variant="neutral">
                <SquarePen />
              </Button>
            </UpdateUserDialog>

            {/** user deletion */}
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
                    Người dùng sẽ không bị xóa hoàn toàn nhưng hành động này
                    hiện không thể hoàn tác.
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
          </>
        ) : (
          <>
            <SquarePen className="mx-4 md_!mt-6" />
            <Trash2 className="mx-4 md_!mt-6" />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTools;
