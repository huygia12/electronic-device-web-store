import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FC, HTMLAttributes } from "react";

interface SearchBoxProps extends HTMLAttributes<HTMLDivElement> {
  setSearchText: (value: string) => void;
}

const SearchBox: FC<SearchBoxProps> = ({ ...props }) => {
  return (
    <div className="relative h-[3rem] mt-8 mb-4">
      <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Tìm kiếm..."
        className="h-full text-lg w-full rounded-xl bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0"
        onChange={(e) => props.setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
