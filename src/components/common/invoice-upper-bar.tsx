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
      className={cn("flex flex-row items-center space-x-4 ", props.className)}
    >
      <SearchBox
        setSearchText={props.setSearchText}
        placeholder={props.searchPlaceholder}
        className="flex-1"
      />

      <Select
        value={props.defaultSelectedStatus}
        onValueChange={(value) =>
          props.setSelectedStatus(value as InvoiceStatus)
        }
      >
        <SelectTrigger className="w-[18rem] h-[3rem]">
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
