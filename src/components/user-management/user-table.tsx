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
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/utils/helpers";
import { User } from "@/types/model";
import Badge from "@/components/ui/badge";
import { userService } from "@/services";
import { cn } from "@/lib/utils";
import { Role } from "@/types/enum";

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
    <Card className={cn("rounded-md shadow-lg", props.className)}>
      <CardContent className="flex flex-col px-0 xss_px-4">
        <ScrollArea className="relavtive h-[58vh] pb-3">
          <Table>
            <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
              <tr className="text-nowrap text-black text-xs md_text-[1rem]">
                <TableHead className="text-center font-extrabold">
                  STT
                </TableHead>
                <TableHead className="text-center font-extrabold">
                  TÊN
                </TableHead>
                <TableHead className="text-center font-extrabold hidden 2xl_table-cell">
                  SỐ LIÊN LẠC
                </TableHead>
                <TableHead className="text-center font-extrabold hidden sms_table-cell">
                  NGÀY ĐĂNG KÝ
                </TableHead>
                <TableHead className="text-center font-extrabold hidden xl_table-cell">
                  EMAIL
                </TableHead>
                <TableHead className="text-center font-extrabold">
                  VAI TRÒ
                </TableHead>
                <TableHead className="text-center font-extrabold">
                  KHÓA TK
                </TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {props.users.map((user, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    "cursor-pointer text-xs md_text-base",
                    props.selectedUser?.userID === user.userID &&
                      "bg-theme-softer"
                  )}
                  onClick={() => props.setSelectedUser(user)}
                >
                  <TableCell className="text-center">
                    {(props.currentPage - 1) * props.limitPerPage + index + 1}
                  </TableCell>
                  <TableCell className="text-center max-w-[8rem] md_max-w-[14rem] truncate">
                    {user.userName}
                  </TableCell>
                  <TableCell className="text-center hidden 2xl_table-cell">
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell className="text-center lg_text-nowrap hidden sms_table-cell">
                    {formatDateTime(`${user.createdAt}`)}
                  </TableCell>
                  <TableCell className="text-center hidden xl_table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-blue-500 text-white text-nowrap h-8 hidden hover_!bg-blue-500 xs_flex xs_justify-center">
                      {userService.getRoleToDisplay(user.role)}
                    </Badge>
                    <Badge className="bg-blue-500 text-white text-nowrap h-8 flex justify-center hover_!bg-blue-500 xs_hidden">
                      {userService.getRoleToDisplayInShort(user.role)}
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
