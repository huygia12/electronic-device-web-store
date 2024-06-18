import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HTMLAttributes } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { AttributeOption } from "@/declare";
import { buttonVariants } from "@/utils/constants";

interface AttibuteDialogProps extends HTMLAttributes<HTMLFormElement> {
  option?: AttributeOption;
  formTitle: string;
}

const OptionDialog: React.FC<AttibuteDialogProps> = ({
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
              defaultValue={props.option?.optionValue}
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

export default OptionDialog;
