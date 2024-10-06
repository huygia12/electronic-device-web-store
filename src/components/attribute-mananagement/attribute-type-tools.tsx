import { Card, CardContent } from "@/components/ui/card";
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
import { FC, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Attribute } from "@/types/model";
import { buttonVariants } from "@/utils/constants";
import { Optional } from "@/utils/declare";
import AttributeDialog from "./attribute-dialog";

interface AttributeTypeProps extends HTMLAttributes<HTMLDivElement> {
  selectedAttribute: Optional<Attribute>;
  handleAddAttributeType: (value: string) => void;
  handleUpdateAttributeType: (value: string) => void;
  handleDeleteAttributeType: () => void;
}

const AttributeTypeTools: FC<AttributeTypeProps> = ({ ...props }) => {
  return (
    <Card className="rounded-xl shadow-lg">
      <CardContent className="p-4 space-y-4 contain-content">
        <AttributeDialog
          dialogTitle="Thêm thuộc tính mới"
          handleDialogAcceptEvent={props.handleAddAttributeType}
        >
          <Button className="" variant="positive">
            <Plus />
          </Button>
        </AttributeDialog>
        {props.selectedAttribute ? (
          <>
            <AttributeDialog
              attribute={props.selectedAttribute}
              dialogTitle="Sửa tên thuộc tính"
              handleDialogAcceptEvent={props.handleUpdateAttributeType}
            >
              <Button variant="neutral">
                <SquarePen />
              </Button>
            </AttributeDialog>

            {/** Attribute deletion dialog */}
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
                    Hành động này sẽ trực tiếp xóa thuộc tính của sản phẩm và
                    không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={props.handleDeleteAttributeType}
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

export default AttributeTypeTools;
