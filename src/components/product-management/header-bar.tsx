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
import { Button } from "../ui/button";
import { Optional } from "@/utils/declare";

interface HeaderbarProps extends HTMLAttributes<HTMLDivElement> {
  setSearchingInput: (text: string) => void;
  providers: Provider[];
  categories: Category[];
  selectedCategory: Optional<string>;
  selectedProvider: Optional<string>;
  setSelectedCategory: (id: string) => void;
  setSelectedProvider: (id: string) => void;
  handleRefreshFilter: () => void;
}

const HeaderBar: FC<HeaderbarProps> = ({ ...props }) => {
  const [categoryKey, setCategoryKey] = useState<number>(1);
  const [providerKey, setProviderKey] = useState<number>(3);

  useEffect(() => {
    !props.selectedCategory && setCategoryKey(categoryKey === 1 ? 2 : 1);
    !props.selectedProvider && setProviderKey(providerKey === 3 ? 4 : 3);
  }, [props.selectedCategory, props.selectedProvider]);

  return (
    <div className="flex space-x-4">
      <span className="relative h-[3rem] flex-1">
        <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Tìm kiếm..."
          className="h-full text-lg w-full rounded-md bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0"
          onChange={(e) => props.setSearchingInput(e.target.value)}
        />
      </span>

      <span className="flex items-center space-x-4">
        <Select
          key={categoryKey}
          onValueChange={(value) => props.setSelectedCategory(value)}
        >
          <SelectTrigger className="w-[12rem] h-full">
            <SelectValue placeholder="Phân loại" />
          </SelectTrigger>
          <SelectContent>
            {props.categories.map((category, index) => (
              <SelectItem key={index} value={category.categoryID}>
                {category.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          key={providerKey}
          onValueChange={(value) => props.setSelectedProvider(value)}
        >
          <SelectTrigger key={providerKey} className="w-[12rem] h-full">
            <SelectValue placeholder="Nhà cung cấp" />
          </SelectTrigger>
          <SelectContent>
            {props.providers.map((provider, index) => (
              <SelectItem key={index} value={provider.providerID}>
                {provider.providerName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          className="h-full"
          onClick={props.handleRefreshFilter}
        >
          Làm mới
        </Button>
      </span>
    </div>
  );
};

export default HeaderBar;
