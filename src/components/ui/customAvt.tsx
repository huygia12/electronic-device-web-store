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
import { User } from "lucide-react";
import { LinkItem } from "@/declare";
import { useCurrAccount } from "@/utils/customHook";

interface CustomAvtProps extends HTMLAttributes<HTMLDivElement> {
  options?: LinkItem[];
}

const defaultOptions: LinkItem[] = [
  {
    name: "Đăng Nhập",
    src: "/login",
  },
  {
    name: "Đăng Ký",
    src: "/signup",
  },
];

const CustomAvt: React.FC<CustomAvtProps> = ({ className, ...props }) => {
  const { currAccount } = useCurrAccount();

  return (
    <div
      className={cn("flex flex-row items-center space-x-[0.5rem]", className)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="overflow-hidden rounded-full h-14 w-14 focus-visible_outline-none"
          >
            <Avatar className="h-[3.5rem] w-[3.5rem]">
              <AvatarImage
                src={currAccount?.avt}
                width={40}
                height={40}
                alt="AVT"
                className="focus-visible_!outline-none"
              />
              <AvatarFallback className="text-stone-800 hover_border-4 hover_border-primary hover_bg-primary-softer hover_text-primary focus-visible_outline-none">
                <User size={40} />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {currAccount && (
            <DropdownMenuLabel className="border-b-2 border-stone-500">
              Tài Khoản Của Tôi
            </DropdownMenuLabel>
          )}
          <DropdownMenuSeparator />
          {(props.options && currAccount ? props.options : defaultOptions).map(
            (item, index) => (
              <DropdownMenuItem key={index}>
                <NavLink to={item.src} unstable_viewTransition>
                  {item.name}
                </NavLink>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="font-extrabold max-w-52 text-[1.2rem] truncate ...">
        {currAccount?.accountName}
      </div>
    </div>
  );
};

export default CustomAvt;
