import { Button } from "@/components/ui/button";
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
import UserForm from "@/components/userForm";
import { User } from "@/declare";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

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

const users: User[] = [
  {
    id: "CT061",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
  {
    id: "ct061",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
  {
    id: "CT063",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
  {
    id: "CT064",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
  {
    id: "CT065",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
  {
    id: "CT066",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
  {
    id: "CT067",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
  {
    id: "CT068",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
  {
    id: "CT069",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
  {
    id: "CT070",
    name: "Bui Minh Khanh",
    avt: "/avt.jpg",
    passwd: "123456a@",
    phoneNumber: "0336917223",
    createdAt: new Date(2024, 5, 15, 12, 11, 5),
    email: "khanhwf@gmail.com",
  },
];

const UserManagement = () => {
  const [existingUsers, setExistUsers] = useState(users);

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
    <main className="w-adminLayout mx-auto my-10">
      <UserForm formTitle="Thêm khách hàng mới">
        <Button className="text-xl">
          Thêm khách hàng mới
          <Plus />
        </Button>
      </UserForm>

      {/** Table */}
      <Table className="my-10">
        <TableHeader className="border-b-secondary-foreground border-b-2">
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
              <TableCell className="text-center text-base">{user.id}</TableCell>
              <TableCell className="text-center  text-base">
                {user.name}
              </TableCell>
              <TableCell className="text-center text-base">
                {user.phoneNumber}
              </TableCell>
              <TableCell className="text-center text-base">
                {user.createdAt.toLocaleTimeString() +
                  " " +
                  user.createdAt.toLocaleDateString()}
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
                <UserForm formTitle="Sửa thông tin khách hàng" user={user}>
                  <Button variant="neutral">
                    <SquarePen />
                  </Button>
                </UserForm>
                <Button variant="negative" onClick={() => deleteUser(user.id)}>
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
    </main>
  );
};

export default UserManagement;
