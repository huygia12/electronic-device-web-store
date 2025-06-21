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

const headers = [
  { title: "STT" },
  {
    title: "TÊN",
  },
  {
    title: "SỐ LIÊN LẠC",
    css: "hidden 2xl_table-cell",
  },
  {
    title: "NGÀY ĐĂNG KÝ",
  },
  {
    title: "EMAIL",
  },
  {
    title: "VAI TRÒ",
  },
  {
    title: "KHÓA TK",
  },
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
    <Card className={cn("rounded-md shadow-lg w-full", props.className)}>
      <CardContent className="flex flex-col px-0 xss_px-4 w-full">
        <ScrollArea className="relavtive h-[58vh] w-full pb-3">
          <Table>
            <TableHeader className="z-10 border-b-secondary-foreground border-b-2 sticky top-0 bg-white shadow-lg">
              <tr className="text-nowrap text-black text-xs md_text-base">
                {headers.map((header, index) => (
                  <TableHead
                    key={index}
                    className={cn("font-extrabold text-center", header.css)}
                  >
                    {header.title}
                  </TableHead>
                ))}
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
                  <TableCell className="text-center lg_text-nowrap">
                    {formatDateTime(`${user.createdAt}`)}
                  </TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
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
                      checked={user.isBanned ?? false}
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
