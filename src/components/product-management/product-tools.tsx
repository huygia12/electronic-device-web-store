import { Button } from "@/components/ui/button";
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
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { buttonVariants } from "@/utils/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { FC, HTMLAttributes } from "react";
import { ProductSummary } from "@/types/payload";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SideBarProps extends HTMLAttributes<HTMLDivElement> {
  selectedProduct?: ProductSummary;
  setDeepCleanProductID: (productID: string | undefined) => void;
  handleDeleteProduct: () => void;
}

const ProductTools: FC<SideBarProps> = ({ ...props }) => {
  return (
    <Card className={cn("rounded-xl shadow-lg", props.className)}>
      <CardContent className="p-4 space-y-4 flex flex-col contain-content">
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
                    Hành động này sẽ trực tiếp xóa sản phẩm và không thể hoàn
                    tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="items-top flex space-x-2">
                  <Checkbox
                    id="deep-clean-checkbox"
                    className="!text-white"
                    onClick={() =>
                      props.setDeepCleanProductID(
                        props.selectedProduct?.productID
                      )
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="deep-clean-checkbox"
                      className="text-sm font-medium leading-none peer-disabled_cursor-not-allowed peer-disabled_opacity-70"
                    >
                      Dọn dẹp sâu
                    </label>
                    <p className="text-sm text-muted-foreground">
                      lịch sử giao dịch sẽ không hiển thị được ảnh sản phẩm nữa.
                    </p>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={props.handleDeleteProduct}
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

export default ProductTools;
