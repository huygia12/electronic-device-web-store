import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FC, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SearchBoxProps extends HTMLAttributes<HTMLDivElement> {
  setSearchText: (value: string) => void;
  placeholder?: string;
}

const SearchBox: FC<SearchBoxProps> = ({ ...props }) => {
  return (
    <div className={cn("relative h-[3rem]", props.className)}>
      <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
      <Input
        type="search"
        placeholder={props.placeholder || "Tìm kiếm..."}
        className="h-full text-sm md_text-lg w-full rounded-md bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0"
        onChange={(e) => props.setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
