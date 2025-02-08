import { FC, HTMLAttributes } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/utils/helpers";
import { User } from "@/types/model";
import Badge from "@/components/ui/badge";
import { userService } from "@/services";
import { cn } from "@/lib/utils";
import { Role } from "@/types/enum";

const columnHeaders = [
  "STT",
  "TÊN",
  "SỐ LIÊN LẠC",
  "NGÀY ĐĂNG KÝ",
  "EMAIL",
  "VAI TRÒ",
  "KHÓA TÀI KHOẢN",
];

interface UserTableProps extends HTMLAttributes<HTMLTableElement> {
  users: User[];
  selectedUser: User | undefined;
  setSelectedUser: (user: User) => void;
  handleBanUser: (value: boolean) => void;
  limitPerPage: number;
  currentPage: number;
}

const UserTable: FC<UserTableProps> = ({ ...props }) => {
  return (
    <Card className={cn("rounded-2xl shadow-lg", props.className)}>
      <CardHeader className="py-6">
        <CardTitle className="text-8">Danh sách khách hàng</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col px-4">
        <ScrollArea className="relavtive h-[58vh] pr-3 pb-3">
          <Table>
            <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
              <tr>
                {columnHeaders.map((item, key) => {
                  return (
                    <TableHead
                      key={key}
                      className="text-nowrap text-center text-black font-extrabold text-[1rem]"
                    >
                      {item}
                    </TableHead>
                  );
                })}
              </tr>
            </TableHeader>
            <TableBody>
              {props.users.map((user, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    "cursor-pointer",
                    props.selectedUser?.userID === user.userID &&
                      "bg-theme-softer"
                  )}
                  onClick={() => props.setSelectedUser(user)}
                >
                  <TableCell className="text-center text-base">
                    {(props.currentPage - 1) * props.limitPerPage + index + 1}
                  </TableCell>
                  <TableCell className="text-center text-base w-[6vw] max-w-[14rem] truncate">
                    {user.userName}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell className="text-center text-base 2xl_text-nowrap">
                    {formatDateTime(`${user.createdAt}`)}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center text-base">
                    <Badge className="bg-blue-500 text-white text-base text-nowrap h-8 hover_!bg-blue-500">
                      {userService.getRoleToDisplay(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      disabled={user.role === Role.ADMIN}
                      defaultChecked={user.isBanned || false}
                      onCheckedChange={props.handleBanUser}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UserTable;
