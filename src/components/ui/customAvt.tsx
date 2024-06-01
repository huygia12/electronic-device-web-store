import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface CustomAvtProps extends HTMLAttributes<HTMLDivElement> {
  avt: string;
  alt: string;
  name: string;
}

const CustomAvt: React.FC<CustomAvtProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("flex flex-row items-center space-x-[0.5rem]", className)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="overflow-hidden rounded-full h-14 w-14"
          >
            <Avatar className="h-[3.5rem] w-[3.5rem]">
              <AvatarImage
                src={props.avt}
                width={50}
                height={50}
                alt="Avatar"
              />
              <AvatarFallback>{props.alt}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <NavLink to="/login">Đăng xuất</NavLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="font-extrabold max-w-52 text-[1.2rem] truncate ...">
        {props.name}
      </div>
    </div>
  );
};

export default CustomAvt;
