import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HTMLAttributes, useState } from "react";
import { Category } from "@/types/model";
import { buttonVariants } from "@/utils/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CategoryDialogProps extends HTMLAttributes<HTMLFormElement> {
  category?: Category;
  dialogTitle: string;
  handleDialogAcceptEvent: (name: string) => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  className,
  ...props
}) => {
  const [name, setName] = useState<string>(props.category?.categoryName ?? "");
  const [isDisable, setIsDisable] = useState(true);

  const handleInputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target.value);
    if (e.target.value.length === 0) {
      setIsDisable(true);
      return;
    }
    setIsDisable(false);
  };

  const resetInputValue = () => {
    setName(props.category?.categoryName ?? "");
  };

  return (
    <form>
      <Dialog>
        <DialogTrigger asChild onClick={() => resetInputValue()}>
          {props.children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="name" className="col-span-2 text-right text-lg">
              Danh mục
            </Label>
            <Input
              type="text"
              id="name"
              className="col-span-3"
              value={name}
              autoComplete="off"
              onChange={(e) => handleInputEvent(e)}
            />
          </div>
          <DialogFooter className="flex-row-reverse gap-2">
            <DialogClose
              type="submit"
              disabled={isDisable}
              className={buttonVariants({
                variant: isDisable ? "secondary" : "positive",
              })}
              onClick={async () => await props.handleDialogAcceptEvent(name)}
            >
              Lưu
            </DialogClose>
            <DialogClose className={buttonVariants({ variant: "outline" })}>
              Hủy
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default CategoryDialog;
