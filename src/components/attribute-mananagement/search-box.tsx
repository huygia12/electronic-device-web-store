import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FC, HTMLAttributes } from "react";

interface SearchBoxProps extends HTMLAttributes<HTMLDivElement> {
  handleSearching: (text: string) => void;
}

const SearchBox: FC<SearchBoxProps> = ({ ...props }) => {
  return (
    <div className="relative h-[3rem] mt-8 col-span-5">
      <Search className="absolute left-4 top-3 h-6 w-6 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Tìm kiếm..."
        className="h-full text-lg w-full rounded-xl bg-background pl-14 focus-visible_!ring-0 focus-visible_!ring-offset-0"
        onChange={(e) => {
          props.handleSearching(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchBox;
