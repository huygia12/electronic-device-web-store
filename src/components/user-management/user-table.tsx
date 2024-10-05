import { FC, HTMLAttributes } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SquarePen, Trash2 } from "lucide-react";
import UpdateUserDialog from "@/components/admin/update-user-dialog";
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
import { formatDateTime } from "@/utils/helpers";
import { User } from "@/types/model";
import { Button } from "@/components/ui/button";

const colName: string[] = [
  "STT",
  "ID KHÁCH HÀNG",
  "TÊN",
  "SỐ LIÊN LẠC",
  "NGÀY ĐĂNG KÝ",
  "EMAIL",
  "KHÓA NGƯỜI DÙNG",
  "THAO TÁC",
];

interface UserTableProps extends HTMLAttributes<HTMLTableElement> {
  users: User[];
  handleDeleteUser: (userID: string) => void;
  hadnleEditUser: (user: User) => void;
}

const UserTable: FC<UserTableProps> = ({ ...props }) => {
  return (
    <ScrollArea className="relavtive h-[58vh]">
      <Table>
        <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
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
          {props.users.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="text-center text-base">
                {index + 1}
              </TableCell>
              <TableCell className="text-center text-base">
                {user.userID}
              </TableCell>
              <TableCell className="text-center  text-base">
                {user.userName}
              </TableCell>
              <TableCell className="text-center text-base">
                {user.phoneNumber}
              </TableCell>
              <TableCell className="text-center text-base">
                {`${formatDateTime(`${user.createdAt}`)}`}
              </TableCell>
              <TableCell className="text-center text-base">
                {user.email}
              </TableCell>
              <TableCell className="text-center">
                <Switch />
              </TableCell>
              <TableCell
                colSpan={3}
                className="flex items-center justify-center space-x-2"
              >
                <UpdateUserDialog
                  user={user}
                  handleUpdateUser={props.hadnleEditUser}
                >
                  <Button variant="neutral">
                    <SquarePen />
                  </Button>
                </UpdateUserDialog>
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
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={() =>
                          user.userID && props.handleDeleteUser(user.userID)
                        }
                        className={buttonVariants({
                          variant: "negative",
                        })}
                      >
                        Xóa
                      </AlertDialogAction>
                      <AlertDialogCancel className="mt-0">
                        Hủy
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default UserTable;
