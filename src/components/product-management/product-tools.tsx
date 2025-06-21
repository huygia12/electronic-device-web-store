import { Button } from "@/components/ui/button";
import { Plus, RefreshCcwDot, SquarePen, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { FC, HTMLAttributes } from "react";
import { ProductSummary } from "@/types/payload";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ProductDeletionDialog from "./product-deletion-dialog";
import { CheckedState } from "@radix-ui/react-checkbox";

interface SideBarProps extends HTMLAttributes<HTMLDivElement> {
  selectedProduct?: ProductSummary;
  setDeepCleanProductID: (productID: string | undefined) => void;
  handleDeleteProduct: () => void;
  handleRefreshFilter?: () => void;
}

const ProductTools: FC<SideBarProps> = ({ ...props }) => {
  const handleDeepCleanCheckbox = (check: CheckedState) => {
    props.setDeepCleanProductID(
      check ? props.selectedProduct?.productID : undefined
    );
  };

  return (
    <Card className={cn("rounded-md shadow-lg", props.className)}>
      <CardContent className="p-4 contain-content flex items-center flex-row gap-4 lgg_flex-col">
        {/** add button */}
        <NavLink to="/admin/products/add" unstable_viewTransition>
          <Button variant="positive">
            <Plus />
          </Button>
        </NavLink>
        {props.selectedProduct ? (
          <>
            {/** edit button */}
            <NavLink
              to={`/admin/products/${props.selectedProduct.productID}`}
              unstable_viewTransition
            >
              <Button variant="neutral">
                <SquarePen />
              </Button>
            </NavLink>

            {/** delete button */}
            <ProductDeletionDialog
              onDeepCleanCheck={handleDeepCleanCheckbox}
              onDeleteAccept={props.handleDeleteProduct}
            />
          </>
        ) : (
          <>
            <SquarePen className="mx-4 lgg_!mt-6" />
            <Trash2 className="mx-4 lgg_!mt-6" />
          </>
        )}
        <Button
          variant="destructive"
          className="h-full ml-auto text-sm block md_text-base md_hidden"
          onClick={props.handleRefreshFilter}
        >
          <span className="hidden sms_inline">Làm mới</span>
          <RefreshCcwDot className="sms_hidden" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductTools;
