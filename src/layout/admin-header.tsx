import { RiNotification2Fill } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { Package2 } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AdminAccordion } from "@/components/admin";
import { CounterLabel } from "@/components/avatar-placeholder.tsx";
import CustomAvt from "@/components/common/custom-avatar";
import { navItems } from "@/utils/constants";
import auth from "@/utils/auth";
import { useAuth, useCustomNavigate } from "@/hooks";

const AdminHeader = () => {
  const { navigate } = useCustomNavigate();
  const { logout } = useAuth();
  const userOptions = useRef([
    {
      name: "Tài Khoản Của Tôi",
      src: "/profile",
    },
    {
      name: "Đăng Xuất",
      handleClick: async () => {
        try {
          await logout();

          toast.success("Đăng xuất thành công!");
          auth.token.removeAccessToken();
          navigate("/login", { unstable_viewTransition: true });
        } catch (error: unknown) {
          console.error(`Response data: ${error}`);
        }
      },
    },
  ]);

  return (
    <div className="w-full py-3 flex flex-col sticky top-0 z-50 bg-theme shadow-xl items-center">
      <div className="w-adminLayout flex items-center justify-between">
        {/** NAV BAR */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <TbCategoryPlus size={55} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="max-w-xs">
            <nav className="grid gap-8 text-lg font-medium">
              <div className="group flex h-16 w-16 items-center justify-center rounded-full bg-theme">
                <Package2 className="h-10 w-10 transition-all group-hover_scale-110" />
              </div>
              <ScrollArea className="h-[100vh] px-3">
                {navItems.map((item, index) =>
                  item.hasChild ? (
                    <AdminAccordion key={index} subItems={item.children}>
                      <div className="flex text-[1.1rem] items-center gap-2 px-2.5 text-muted-foreground hover_text-primary-foreground">
                        <span>
                          <item.icon className="h-5 w-5" />
                        </span>
                        <span>{item.name}</span>
                      </div>
                    </AdminAccordion>
                  ) : (
                    <div key={index}>
                      <NavLink
                        to={item.url}
                        className="flex text-[1.1rem] border-b py-4 px-2.5"
                      >
                        <SheetClose className="flex items-center gap-2 text-muted-foreground hover_text-primary-foreground">
                          <span>
                            <item.icon className="h-5 w-5" />
                          </span>
                          <span>{item.name}</span>
                        </SheetClose>
                      </NavLink>
                    </div>
                  )
                )}
              </ScrollArea>
            </nav>
          </SheetContent>
        </Sheet>

        {/** NOTIFICATION AND AVATAR */}
        <div className="flex items-center">
          <div className="relative">
            <RiNotification2Fill size={34} />
            <CounterLabel
              counter={6}
              className="left-[-0.9rem] top-[-1.1rem]"
            />
          </div>
          <CustomAvt className="ml-10" options={userOptions.current} />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
