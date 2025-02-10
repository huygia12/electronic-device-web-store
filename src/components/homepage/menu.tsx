import { SwatchBook } from "lucide-react";
import { LinesSkeleton } from "@/components/common/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC, HTMLAttributes } from "react";
import { Category, Provider } from "@/types/model";
import { useCustomNavigate } from "@/hooks";
import { cn } from "@/lib/utils";

interface HomepageMenuProps extends HTMLAttributes<HTMLDivElement> {
  categories: Category[] | undefined;
  providers: Provider[] | undefined;
}

const HomepageMenu: FC<HomepageMenuProps> = ({ ...props }) => {
  const { navigate } = useCustomNavigate();

  return (
    <div
      id="category_menu"
      className={cn(
        "bg-white shadow-general rounded-lg overflow-y-auto",
        props.className
      )}
    >
      <h1 className="bg-theme flex items-center font-semibold py-4 px-2">
        <SwatchBook className="min-w-6 size-6" />
        <span className="text-xs md_text-[0.9rem]">DANH MỤC SẢN PHẨM</span>
      </h1>
      <Select
        onValueChange={async (e) => {
          navigate(`products?providerID=${e}`, {
            unstable_viewTransition: true,
          });
        }}
      >
        <SelectTrigger className="w-full h-12 p-3 text-sm md_text-base pl-8  font-medium focus_!ring-0 focus_!ring-offset-0 focus_rounded-none border-b-0 hover_font-semibold hover_border-l-8 hover_border-l-theme-softer hover_bg-slate-200">
          <SelectValue placeholder="Nhãn hàng" />
        </SelectTrigger>
        <SelectContent className="-right-[104%] -top-[2.8rem]">
          {props.providers?.map((provider, index) => {
            return (
              <SelectItem
                key={index}
                value={provider.providerID}
                className="text-sm md_text-base"
              >
                {provider.providerName}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {props.categories ? (
        <ul>
          {props.categories.map((cate, index) => {
            return (
              <li
                onClick={() => {
                  navigate(`products?categoryID=${cate.categoryID}`, {
                    unstable_viewTransition: true,
                  });
                }}
                key={index}
                className="w-full p-3 text-sm md_text-base pl-8 font-medium cursor-pointer hover_bg-slate-200 hover_font-semibold hover_border-l-8 hover_border-l-theme-softer truncate"
              >
                {cate.categoryName}
              </li>
            );
          })}
        </ul>
      ) : (
        <LinesSkeleton quantity={5} />
      )}
    </div>
  );
};

export default HomepageMenu;
