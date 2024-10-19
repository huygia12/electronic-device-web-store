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
import { Attribute, AttributeOption } from "@/types/model";
import { buttonVariants } from "@/utils/constants";
import OptionDialog from "./option-dialog";

interface AttributeOptionProps extends HTMLAttributes<HTMLDivElement> {
  selectedAttribute: Attribute | undefined;
  selectedAttributeOption: AttributeOption | undefined;
  handleAddAttributeOption: (value: string) => void;
  handleUpdateAttributeOption: (value: string) => void;
  handleDeleteAttributeOption: () => void;
}

const AttributeOptionTools: FC<AttributeOptionProps> = ({ ...props }) => {
  return (
    <Card className="rounded-xl shadow-lg">
      <CardContent className="p-4 space-y-4 contain-content">
        {props.selectedAttribute ? (
          <OptionDialog
            formTitle="Thêm giá trị mới"
            handleDialogAcceptEvent={props.handleAddAttributeOption}
          >
            <Button className="" variant="positive">
              <Plus />
            </Button>
          </OptionDialog>
        ) : (
          <Plus className="mx-4 !mb-7v !mt-3" />
        )}
        {props.selectedAttributeOption &&
        props.selectedAttribute?.attributeOptions ? (
          <>
            <OptionDialog
              option={props.selectedAttributeOption}
              formTitle="Sửa tên giá trị"
              handleDialogAcceptEvent={props.handleUpdateAttributeOption}
            >
              <Button variant="neutral">
                <SquarePen />
              </Button>
            </OptionDialog>

            {/** attribute option deletion */}
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
                    Hành động này sẽ trực tiếp xóa giá trị của thuộc tính và
                    không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={props.handleDeleteAttributeOption}
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

export default AttributeOptionTools;
