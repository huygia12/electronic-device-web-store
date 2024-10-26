import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { toast } from "sonner";

interface TableUtilMenuProps extends HTMLAttributes<HTMLDivElement> {
  textToCopy: string;
}

const TableContextMenu: FC<TableUtilMenuProps> = ({ ...props }) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(props.textToCopy)
      .then(() => {
        toast.success("Sao chép vào clip board!");
      })
      .catch(() => {
        toast.error("Sao chép thất bại:");
      });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{props.children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-theme-softer text-gray-600">
        <ContextMenuItem onClick={handleCopy} className="text-base" inset>
          Sao chép mã
          <ContextMenuShortcut>
            <Copy />
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default TableContextMenu;
