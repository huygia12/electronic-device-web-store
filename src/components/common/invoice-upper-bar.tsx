import { SearchBox } from "@/components/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { InvoiceStatus } from "@/types/enum";
import { getInvoiceStatus } from "@/utils/helpers";
import { FC, HTMLAttributes } from "react";

interface HeaderBarProps extends HTMLAttributes<HTMLDivElement> {
  searchPlaceholder?: string;
  defaultSelectedStatus?: InvoiceStatus;
  setSearchText: (text: string) => void;
  setSelectedStatus: (status: InvoiceStatus) => void;
}

const HeaderBar: FC<HeaderBarProps> = ({ ...props }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 xs_flex-row items-center ",
        props.className
      )}
    >
      <SearchBox
        setSearchText={props.setSearchText}
        placeholder={props.searchPlaceholder}
        className="flex-1 w-full"
      />

      <Select
        value={props.defaultSelectedStatus}
        onValueChange={(value) =>
          props.setSelectedStatus(value as InvoiceStatus)
        }
      >
        <SelectTrigger className="w-full xs_w-[14rem] h-[3rem]">
          <SelectValue placeholder="Trạng Thái Đơn Hàng" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(InvoiceStatus).map((e) => (
            <SelectItem key={e} value={e}>
              {getInvoiceStatus(e as InvoiceStatus)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeaderBar;
