import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { AddUserDialog } from "@/components/admin";
import { User } from "@/types/model";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { userService } from "@/services";
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

const UserManagement: FC = () => {
  const users = useRouteLoaderData("user_management") as User[];
  const [existingUsers, setExistUsers] = useState(users);

  const handleDeleteUser = async (userID: string) => {
    try {
      await userService.apis.deleteUser(userID);

      setExistUsers(
        existingUsers.filter((userHolder) => userHolder.userID !== userID)
      );
      toast.success("Xóa thành công!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Response data: ${error.response?.data}`);
        console.error(`Response status: ${error.response?.status})`);
      } else {
        console.error("Unexpected error:", error);
      }
      toast.error("Xóa thất bại!");
    }
  };

  const handleUpdateUser = (user: User) => {
    setExistUsers(
      existingUsers.map((userHolder) => {
        if (userHolder.userID === user.userID) {
          return user;
        }
        return userHolder;
      })
    );
  };

  const handleAddUser = (user: User) => {
    setExistUsers([...existingUsers, user]);
  };

  return (
    <>
      <Card className="rounded-2xl shadow-lg my-8">
        <CardContent className="flex justify-between p-6">
          <AddUserDialog handleAddUser={handleAddUser}>
            <Button variant="positive" className="text-xl">
              Thêm khách hàng mới
              <Plus />
            </Button>
          </AddUserDialog>

          <div className="relative flex-1 md_grow-0 h-[2.5rem]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm..."
              className="h-full text-xl w-full rounded-lg bg-background pl-8 md_w-[200px] lg_w-[336px]"
            />
          </div>
        </CardContent>
      </Card>

      {/** Table */}
      <Card className="rounded-2xl shadow-lg mb-4">
        <CardHeader className="py-6 px-10">
          <CardTitle className="text-8">Danh sách khách hàng</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col px-6 pb-4">
          <ScrollArea className=" relavtive h-[58vh]">
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
                {existingUsers.map((user, index) => (
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
                        handleUpdateUser={handleUpdateUser}
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
                              Người dùng sẽ không bị xóa hoàn toàn nhưng hành
                              động này hiện không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction
                              onClick={() =>
                                user.userID && handleDeleteUser(user.userID)
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
        </CardContent>
      </Card>

      {/** Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};

export default UserManagement;
