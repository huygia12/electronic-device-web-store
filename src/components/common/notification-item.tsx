import { FC, HTMLAttributes } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NotificationItemProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  description: string;
  to?: string;
}

const NotificationItem: FC<NotificationItemProps> = ({ ...props }) => {
  return (
    <Card
      className={cn(
        "flex flex-row rounded-none",
        props.to ? "cursor-pointer hover_bg-slate-200" : ""
      )}
    >
      <CardContent className="col-span-3 p-4 w-full h-full my-auto">
        <NavLink
          to={props.to || ``}
          unstable_viewTransition
          className={cn(
            "flex items-center gap-4 ",
            props.to ? "" : "cursor-default"
          )}
        >
          <Avatar className="w-14 h-14">
            <AvatarImage src={props.imageUrl} />
            <AvatarFallback>avt</AvatarFallback>
          </Avatar>
          <span className="flex flex-col gap-1">
            <span className="flex flex-col justify-between gap-1">
              <span className="font-extrabold text-[1.1rem]">
                {props.title}
              </span>
              <em className="font-extralight text-sm self-end">
                {props.description}
              </em>
            </span>
          </span>
        </NavLink>
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
