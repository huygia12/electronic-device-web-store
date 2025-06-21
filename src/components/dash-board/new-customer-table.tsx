import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC, HTMLAttributes } from "react";
import { User } from "@/types/model";
import { formatDateTime } from "@/utils/helpers";
import { cn } from "@/lib/utils";

interface NewCustomerTableProps extends HTMLAttributes<HTMLDivElement> {
  newCustomers: User[];
}

const NewCustomerTable: FC<NewCustomerTableProps> = ({
  className,
  ...props
}) => {
  if (props.newCustomers.length === 0) return;

  return (
    <Card className={cn("rounded-2xl shadow-lg", className)}>
      <CardHeader className="px-6 py-2 md_py-6">
        <CardTitle className="text-lg md_text-2xl">Khách hàng mới</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col pb-4 px-0">
        <ScrollArea className="px-4">
          {props.newCustomers.map((customer, index) => {
            return (
              <Card key={index} className="mb-4 flex flex-row shadow-md">
                <CardContent className="col-span-3 p-4 h-full my-auto">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12 md_size-14">
                      <AvatarImage src={customer.avatar || undefined} />
                      <AvatarFallback>avt</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1 w-max">
                      <span className="flex justify-between flex-col sm_flex-row sm_gap-2 ">
                        <span className="font-extrabold text-sm md_text-[1.1rem] max-w-[10rem] md_max-w-[20rem] lgg_w-[10rem] truncate">
                          {customer.userName}
                        </span>
                        <em className="font-extralight text-xs md_text-sm sm_self-end">
                          {customer.email}
                        </em>
                      </span>
                      <span className="font-extralight text-xs md_text-sm">
                        {`Đã gia nhập ${formatDateTime(`${customer.createdAt}`)}`}
                      </span>
                    </div>
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
