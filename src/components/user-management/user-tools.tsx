import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User } from "@/types/model";
import UserUpdateDialog from "./user-update-dialog";
import UserAdditionDialogg from "./user-addition-dialog";
import { SignupFormProps, UserFormProps } from "@/utils/schema";
import UserDeletionDialog from "./user-deletion-dialog";

interface UserToolsProps extends HTMLAttributes<HTMLDivElement> {
  selectedUser: User | undefined;
  handleDeleteUser: () => void;
  handleUpdateUser: (formProps: UserFormProps, avatarFile?: File) => void;
  handleAddUser: (formProps: SignupFormProps, avatarFile?: File) => void;
}

const UserTools: FC<UserToolsProps> = ({ className, ...props }) => {
  return (
    <Card className={cn("rounded-md shadow-lg", className)}>
      <CardContent className="p-4 contain-content flex items-center flex-row gap-4 lg_flex-col">
        {/** add button */}
        <UserAdditionDialogg handleAddUser={props.handleAddUser}>
          <Button variant="positive" className="text-xl">
            <Plus />
          </Button>
        </UserAdditionDialogg>

        {props.selectedUser ? (
          <>
            {/** user updation */}
            <UserUpdateDialog
              user={props.selectedUser}
              handleUpdateUser={props.handleUpdateUser}
            >
              <Button variant="neutral">
                <SquarePen />
              </Button>
            </UserUpdateDialog>

            {/** user deletion */}
            <UserDeletionDialog handleDeleteUser={props.handleDeleteUser} />
          </>
        ) : (
          <>
            <SquarePen className="mx-4 lg_!mt-6" />
            <Trash2 className="mx-4 lg_!mt-6" />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTools;
