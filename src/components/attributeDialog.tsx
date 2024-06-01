import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { HTMLAttributes } from "react";
import { ProductAttribute } from "@/declare";
import { buttonVariants } from "@/utils/helpers";

interface AttibuteDialogProps extends HTMLAttributes<HTMLFormElement> {
  attribute?: ProductAttribute;
  formTitle: string;
}

const AttributeDialog: React.FC<AttibuteDialogProps> = ({
  className,
  ...props
}) => {
  return (
    <form>
      <Dialog>
        <DialogTrigger asChild>{props.children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.formTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-lg">
              Thể loại
            </Label>
            <Input
              id="name"
              defaultValue={props.attribute?.name}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <DialogClose
              type="submit"
              className={buttonVariants({
                variant: "positive",
              })}
            >
              Lưu
            </DialogClose>
            <DialogClose className={buttonVariants({ variant: "negative" })}>
              Hủy
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default AttributeDialog;
