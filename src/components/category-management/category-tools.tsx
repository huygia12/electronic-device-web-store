import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { buttonVariants } from "@/utils/constants";
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
import { Category } from "@/types/model";
import CategoryDialog from "./category-dialog";
import { cn } from "@/lib/utils";

interface CategoryToolsProps extends HTMLAttributes<HTMLDivElement> {
  selectedCategory: Category | undefined;
  handleAddCategory: (value: string) => void;
  handleUpdateCategory: (value: string) => void;
  handleDeleteCategory: () => void;
}

const CategoryTools: FC<CategoryToolsProps> = ({ className, ...props }) => {
  return (
    <Card className={cn("rounded-md shadow-lg", className)}>
      <CardContent className="p-4 contain-content flex items-center flex-row gap-4 md_flex-col">
        <CategoryDialog
          dialogTitle="Thêm danh mục mới"
          handleDialogAcceptEvent={props.handleAddCategory}
        >
          <Button variant="positive">
            <Plus />
          </Button>
        </CategoryDialog>
        {props.selectedCategory ? (
          <>
            <CategoryDialog
              dialogTitle="Sửa thông tin danh mục"
              category={props.selectedCategory}
              handleDialogAcceptEvent={props.handleUpdateCategory}
            >
              <Button variant="neutral">
                <SquarePen />
              </Button>
            </CategoryDialog>
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
                    Hành động này sẽ trực tiếp xóa danh mục và không thể hoàn
                    tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row-reverse gap-2">
                  <AlertDialogAction
                    onClick={props.handleDeleteCategory}
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

export default CategoryTools;
