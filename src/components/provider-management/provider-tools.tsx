import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { FC, HTMLAttributes } from "react";
import { Provider } from "@/types/model";
import ProviderDialog from "./provider-dialog";
import { cn } from "@/lib/utils";

interface ProviderToolsProps extends HTMLAttributes<HTMLDivElement> {
  selectedProvider: Provider | undefined;
  handleAddProvider: (value: string) => void;
  handleUpdateProvider: (value: string) => void;
  handleDeleteProvider: () => void;
}

const ProviderTools: FC<ProviderToolsProps> = ({ className, ...props }) => {
  return (
    <Card className={cn("rounded-md shadow-lg", className)}>
      <CardContent className="p-4 contain-content flex items-center flex-row gap-4 md_flex-col">
        <ProviderDialog
          dialogTitle="Thêm nhà phân phối mới"
          handleDialogAcceptEvent={props.handleAddProvider}
        >
          <Button variant="positive" className="text-xl">
            <Plus />
          </Button>
        </ProviderDialog>
        {props.selectedProvider ? (
          <>
            <ProviderDialog
              dialogTitle="Sửa thông tin nhà phân phối"
              provider={props.selectedProvider}
              handleDialogAcceptEvent={props.handleUpdateProvider}
            >
              <Button variant="neutral">
                <SquarePen />
              </Button>
            </ProviderDialog>

            {/** provider deletion */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="negative">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn muốn xóa?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này sẽ trực tiếp xóa nhãn hàng và không thể hoàn
                    tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse gap-2">
                  <AlertDialogAction
                    onClick={props.handleDeleteProvider}
                    className={buttonVariants({
                      variant: "negative",
                    })}
                  >
                    Xóa
                  </AlertDialogAction>
                  <AlertDialogCancel className="mt-0">Hủy</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <>
            <SquarePen className="mx-4 md_!mt-6" />
            <Trash2 className="mx-4 md_!mt-6" />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderTools;
