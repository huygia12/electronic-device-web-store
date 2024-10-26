import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC, HTMLAttributes } from "react";
import { User } from "@/types/model";
import { formatDateTime } from "@/utils/helpers";

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
              <Card key={index} className="mb-4 flex flex-row">
                <CardContent className="col-span-3 p-4 w-full h-full my-auto">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={customer.avatar || undefined} />
                      <AvatarFallback>avt</AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col gap-1">
                      <span className="flex justify-between gap-1">
                        <span className="font-extrabold text-[1.1rem] max-w-32 truncate">
                          {customer.userName}
                        </span>
                        <em className="font-extralight text-sm self-end">
                          {customer.email}
                        </em>
                      </span>
                      <span className="font-extralight text-sm">
                        {`Đã gia nhập ${formatDateTime(`${customer.createdAt}`)}`}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NewCustomerTable;
