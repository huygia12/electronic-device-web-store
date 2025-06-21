import { Card, CardContent } from "@/components/ui/card";
import { FC, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Attribute, AttributeOption } from "@/types/model";
import OptionDialog from "./option-dialog";
import OptionDeletionDialog from "./option-deletion-dialog";

interface AttributeOptionProps extends HTMLAttributes<HTMLDivElement> {
  selectedAttribute: Attribute | undefined;
  selectedAttributeOption: AttributeOption | undefined;
  handleAddAttributeOption: (value: string) => void;
  handleUpdateAttributeOption: (value: string) => void;
  handleDeleteAttributeOption: () => void;
}

const AttributeOptionTools: FC<AttributeOptionProps> = ({ ...props }) => {
  return (
    <Card className="rounded-md shadow-lg">
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
            <OptionDeletionDialog
              onDeletionAccept={props.handleDeleteAttributeOption}
            />
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
