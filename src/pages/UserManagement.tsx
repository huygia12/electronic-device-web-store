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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserDialog from "@/components/userDialog";
import { User } from "@/declare";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";

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

const UserManagement = () => {
  const usersData = useRouteLoaderData("user_management") as User[];
  const [existingUsers, setExistUsers] = useState(usersData);

  // const modifyUsers = (userID: string) => {
  //   const temp = existingUsers.forEach((user) => {
  //       if(user.id === userID){

  //       }
  //   });
  //   setExistUsers(temp);
  // };

  const deleteUser = (userID: string) => {
    const temp = existingUsers.filter((user) => user.id !== userID);
    setExistUsers(temp);
  };

  return (
    <>
      <Card className="rounded-2xl shadow-lg my-8">
        <CardContent className="flex justify-between p-6">
          <UserDialog formTitle="Thêm khách hàng mới">
            <Button variant="positive" className="text-xl">
              Thêm khách hàng mới
              <Plus />
            </Button>
          </UserDialog>

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
          <div className="overflow-auto relavtive h-[58vh]">
            <Table>
              <TableHeader className="border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
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
                      {user.id}
                    </TableCell>
                    <TableCell className="text-center  text-base">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {user.phoneNumber}
                    </TableCell>
                    <TableCell className="text-center text-base">
                      {user.createdAt}
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
                      <UserDialog
                        formTitle="Sửa thông tin khách hàng"
                        user={user}
                      >
                        <Button variant="neutral">
                          <SquarePen />
                        </Button>
                      </UserDialog>
                      <Button
                        variant="negative"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
