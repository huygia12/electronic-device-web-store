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
import { FC, HTMLAttributes } from "react";

interface HeaderBarProps extends HTMLAttributes<HTMLDivElement> {
  searchPlaceholder?: string;
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
        onValueChange={(value) =>
          props.setSelectedStatus(value as InvoiceStatus)
        }
      >
        <SelectTrigger className="w-[18rem] h-[3rem]">
          <SelectValue className="" placeholder="Trạng Thái Đơn Hàng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={InvoiceStatus.NEW}>Đang Chờ Duyệt</SelectItem>
          <SelectItem value={InvoiceStatus.PAYMENT_WAITING}>
            Đã Duyệt
          </SelectItem>
          <SelectItem value={InvoiceStatus.SHIPPING}>
            Đang Vận Chuyển
          </SelectItem>
          <SelectItem value={InvoiceStatus.DONE}>
            Giao Hàng Thành Công
          </SelectItem>
          <SelectItem value={InvoiceStatus.ABORT}>Đã Hủy</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeaderBar;
