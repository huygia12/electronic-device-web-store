import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";

const AppClientNav = () => {
  return (
    <nav className="flex flex-row items-center justify-center shadow-md">
      <div className="text-[1.1rem] p-[0.5rem] flex flex-row items-center space-x-[5rem]">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {/* {categories.map((cate) => (
                    <ListItem
                      key={cate}
                      title={cate}
                      href={cate.href}
                    ></ListItem>
                  ))} */}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* <NavLink to="/products">Giới thiệu</NavLink>
        <Select>
          <SelectTrigger className="w-[6.5rem] border-none text-[1.1rem] focus:ring-transparent p-0">
            <SelectValue placeholder="Sản phẩm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" defaultChecked>
              <NavLink
                to={"link"}
                // onClick={() => {
                //   console.log(link);
                //   setLink("/intro");
                // }}
              >
                Tất cả sản phẩm
              </NavLink>
            </SelectItem>
            <Link to={"/products"}>
              <SelectItem value="camera">Camera</SelectItem>
            </Link>
            <NavLink to={"/products"}>
              <SelectItem value="computer">Máy tính</SelectItem>
            </NavLink>
          </SelectContent>
        </Select>
        <NavLink to="/recruitment">Tuyển dụng</NavLink>
        <NavLink to="/announcement">Tin tức</NavLink> */}
      </div>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default AppClientNav;
