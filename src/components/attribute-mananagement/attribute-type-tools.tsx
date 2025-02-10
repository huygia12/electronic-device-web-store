import { Card, CardContent } from "@/components/ui/card";
import { FC, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Attribute } from "@/types/model";
import TypeDialog from "./type-dialog";
import TypeDeletionDialog from "./type-deletion-dialog";

interface AttributeTypeProps extends HTMLAttributes<HTMLDivElement> {
  selectedAttribute: Attribute | undefined;
  handleAddAttributeType: (value: string) => void;
  handleUpdateAttributeType: (value: string) => void;
  handleDeleteAttributeType: () => void;
}

const AttributeTypeTools: FC<AttributeTypeProps> = ({ ...props }) => {
  return (
    <Card className="rounded-md shadow-lg">
      <CardContent className="p-4 space-y-4 contain-content">
        <TypeDialog
          dialogTitle="Thêm thuộc tính mới"
          handleDialogAcceptEvent={props.handleAddAttributeType}
        >
          <Button className="" variant="positive">
            <Plus />
          </Button>
        </TypeDialog>
        {props.selectedAttribute ? (
          <>
            <TypeDialog
              attribute={props.selectedAttribute}
              dialogTitle="Sửa tên thuộc tính"
              handleDialogAcceptEvent={props.handleUpdateAttributeType}
            >
              <Button variant="neutral">
                <SquarePen />
              </Button>
            </TypeDialog>

            {/** Attribute deletion dialog */}
            <TypeDeletionDialog
              onDeletionAccept={props.handleDeleteAttributeType}
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

export default AttributeTypeTools;
