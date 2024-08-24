import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { LinkItem } from "@/types/component";
import { useAuth } from "@/hooks";

interface CustomAvtProps extends HTMLAttributes<HTMLDivElement> {
  options?: LinkItem[];
}

const CustomAvt: React.FC<CustomAvtProps> = ({ className, ...props }) => {
  const { currentUser } = useAuth();

  return (
    <div
      className={cn("flex flex-row items-center space-x-[0.5rem]", className)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="overflow-hidden rounded-full h-14 w-14 hover_!ring-2"
          >
            <Avatar className="h-[3.5rem] w-[3.5rem] focus-visible_!outline-none ">
              <AvatarImage
                src={currentUser?.avatar || undefined}
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
        {props.options && currentUser && (
          <DropdownMenuContent align="center">
            {props.options.map((item, index) => (
              <DropdownMenuItem key={index}>
                {item.src ? (
                  <NavLink
                    to={item.src}
                    onClick={item.handleClick}
                    unstable_viewTransition={true}
                  >
                    {item.name}
                  </NavLink>
                ) : (
                  <button onClick={item.handleClick}>{item.name}</button>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
      <div className="font-semibold max-w-52 text-[1.2rem] truncate ...">
        {currentUser?.userName}
      </div>
    </div>
  );
};

export default CustomAvt;
