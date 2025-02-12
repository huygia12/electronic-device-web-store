import { cn } from "@/lib/utils";
import { SwatchBook } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Category, Provider } from "@/types/model";
import { useCustomNavigate } from "@/hooks";

interface HomepageMenuProps extends HTMLAttributes<HTMLDivElement> {
  categories: Category[] | undefined;
  providers: Provider[] | undefined;
}

const MenuButton: FC<HomepageMenuProps> = ({ className, ...props }) => {
  const { navigate } = useCustomNavigate();

  return (
    <Menubar
      className={cn(
        "fixed z-20 bg-theme text-secondary-foreground size-12 md_size-14 rounded-full",
        className
      )}
    >
      <MenubarMenu>
        <MenubarTrigger>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <SwatchBook className="size-full" />
          </div>
        </MenubarTrigger>
        <MenubarContent className="absolute -top-5 left-12 z-10">
          <MenubarSub>
            <MenubarSubTrigger>Nhãn hàng</MenubarSubTrigger>
            <MenubarSubContent>
              {props.providers?.map((provider) => {
                return (
                  <MenubarItem
                    key={provider.providerID}
                    onClick={() => {
                      navigate(`products?providerID=${provider.providerID}`, {
                        unstable_viewTransition: true,
                      });
                    }}
                    className="text-sm md_text-base"
                  >
                    {provider.providerName}
                  </MenubarItem>
                );
              })}
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          {props.categories?.map((category) => {
            return (
              <MenubarItem
                key={category.categoryID}
                className="text-sm md_text-base"
                onClick={() => {
                  navigate(`products?categoryID=${category.categoryID}`, {
                    unstable_viewTransition: true,
                  });
                }}
              >
                {category.categoryName}
              </MenubarItem>
            );
          })}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default MenuButton;
