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
import { Optional } from "@/utils/declare";
import ProviderDialog from "./provider-dialog";

interface ProviderToolsProps extends HTMLAttributes<HTMLDivElement> {
  selectedProvider: Optional<Provider>;
  handleAddProvider: (value: string) => void;
  handleUpdateProvider: (value: string) => void;
  handleDeleteProvider: () => void;
}

const ProviderTools: FC<ProviderToolsProps> = ({ ...props }) => {
  return (
    <Card className="rounded-xl shadow-lg">
      <CardContent className="p-4 space-y-4 contain-content">
        <ProviderDialog
          dialogTitle="Thêm nhà phân phối mới"
          handleDialogAcceptEvent={props.handleAddProvider}
        >
          <Button className="" variant="positive">
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
                <AlertDialogFooter>
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
            <SquarePen className="mx-4 !mt-6" />
            <Trash2 className="mx-4 !mt-6" />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderTools;
