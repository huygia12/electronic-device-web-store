import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Provider } from "@/types/model";
import { Button } from "@/components/ui/button";

interface UpperBarProps extends HTMLAttributes<HTMLDivElement> {
  setSearchingInput: (text: string) => void;
  providers: Provider[];
  categories: Category[];
  selectedCategory: string | undefined;
  selectedProvider: string | undefined;
  setSelectedCategory: (id: string) => void;
  setSelectedProvider: (id: string) => void;
  handleRefreshFilter: () => void;
}

const UpperBar: FC<UpperBarProps> = ({ ...props }) => {
  const [categoryKey, setCategoryKey] = useState<number>(1);
  const [providerKey, setProviderKey] = useState<number>(3);

  useEffect(() => {
    !props.selectedCategory && setCategoryKey(categoryKey === 1 ? 2 : 1);
    !props.selectedProvider && setProviderKey(providerKey === 3 ? 4 : 3);
  }, [props.selectedCategory, props.selectedProvider]);

  return (
    <div className="flex gap-4 flex-col md_flex-row">
      <div className="relative h-[3rem] flex-1 text-sm md_text-lg">
        <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          className="py-3 md_py-0 h-full w-full rounded-md bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0 placeholder_italic"
          onChange={(e) => props.setSearchingInput(e.target.value)}
        />
      </div>

      <span className="grid grid-cols-2 md_flex items-center gap-4">
        <Select
          key={categoryKey}
          onValueChange={(value) => props.setSelectedCategory(value)}
        >
          <SelectTrigger className="w-full md_w-[12rem] h-full text-sm md_text-base">
            <SelectValue placeholder="Phân loại" />
          </SelectTrigger>
          <SelectContent>
            {props.categories.map((category, index) => (
              <SelectItem
                key={index}
                value={category.categoryID}
                className="text-sm md_text-base"
              >
                {category.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          key={providerKey}
          onValueChange={(value) => props.setSelectedProvider(value)}
        >
          <SelectTrigger className="w-full md_w-[12rem] h-full text-sm md_text-base">
            <SelectValue placeholder="Nhà cung cấp" />
          </SelectTrigger>
          <SelectContent>
            {props.providers.map((provider, index) => (
              <SelectItem
                key={index}
                value={provider.providerID}
                className="text-sm md_text-base"
              >
                {provider.providerName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          className="h-full text-sm hidden md_block md_text-base"
          onClick={props.handleRefreshFilter}
        >
          Làm mới
        </Button>
      </span>
    </div>
  );
};

export default UpperBar;
