import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC, HTMLAttributes } from "react";
import { User } from "@/types/model";
import { formatDateTime } from "@/utils/helpers";
import { NavLink } from "react-router-dom";

interface NewCustomerTableProps extends HTMLAttributes<HTMLDivElement> {
  newCustomers: User[];
}

const NewCustomerTable: FC<NewCustomerTableProps> = ({ ...props }) => {
  if (props.newCustomers.length === 0) return;

  return (
    <Card className="rounded-2xl shadow-lg w-[40%]">
      <CardHeader className="py-6 px-10">
        <CardTitle className="text-8">Khách hàng mới</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col pb-4 px-0">
        <ScrollArea className="h-[20rem] px-4">
          {props.newCustomers.map((customer, index) => {
            return (
              <Card key={index} className="mb-4 flex flex-row py-4">
                <CardHeader className="p-4">
                  <Avatar>
                    <AvatarImage src={customer.avatar || undefined} />
                    <AvatarFallback>avt</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent className="col-span-3 p-0 w-full max-w-60 h-full my-auto">
                  <div className="font-extrabold text-[1.1rem] truncate">
                    {customer.userName}
                  </div>
                  {`Đã gia nhập ${formatDateTime(`${customer.createdAt}`)}`}
                </CardContent>
                <CardFooter className="p-0 px-5 flex">
                  <NavLink to="#">
                    <Button
                      variant="neutral"
                      className=" w-[6.2rem] h-[2rem] !text-sm !rounded-full hover_underline"
                    >
                      Xem chi tiết
                    </Button>
                  </NavLink>
                </CardFooter>
              </Card>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NewCustomerTable;
