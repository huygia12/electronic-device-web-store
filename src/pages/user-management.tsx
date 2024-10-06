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
import { AddUserDialog } from "@/components/admin";
import { User } from "@/types/model";
import { Plus, Search } from "lucide-react";
import { FC, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { userService } from "@/services";
import { UserTable } from "@/components/user-management";

const UserManagement: FC = () => {
  const users = useRouteLoaderData("user_management") as User[];
  const [existingUsers, setExistUsers] = useState(users);

  const handleDeleteUser = async (userID: string) => {
    const deleteUser = userService.apis.deleteUser(userID);
    toast.promise(deleteUser, {
      loading: "Đang xử lý...",
      success: () => {
        setExistUsers(
          existingUsers.filter((userHolder) => userHolder.userID !== userID)
        );
        return "Xóa thành công!";
      },
      error: "Xóa thất bại!",
    });
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
          <UserTable
            users={users}
            handleDeleteUser={handleDeleteUser}
            hadnleEditUser={handleUpdateUser}
          />
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
