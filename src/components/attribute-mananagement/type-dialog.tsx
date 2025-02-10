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
import { Attribute } from "@/types/model";
import { buttonVariants } from "@/utils/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TypeDialogProps extends HTMLAttributes<HTMLFormElement> {
  attribute?: Attribute;
  dialogTitle: string;
  handleDialogAcceptEvent: (name: string) => void;
}

const TypeDialog: React.FC<TypeDialogProps> = ({ className, ...props }) => {
  const [name, setName] = useState<string>(props.attribute?.typeValue ?? "");
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
    setName(props.attribute?.typeValue ?? "");
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
          <div className="grid grid-cols-4 items-center gap-4 text-sm md_text-lg">
            <Label htmlFor="name" className="text-right">
              Thuộc tính
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              autoComplete="off"
              onChange={(e) => handleInputEvent(e)}
              className="col-span-3"
            />
          </div>
          <DialogFooter className="flex-row-reverse gap-2">
            <DialogClose
              type="submit"
              disabled={isDisable}
              onClick={() => props.handleDialogAcceptEvent(name)}
              className={buttonVariants({
                variant: isDisable ? "secondary" : "positive",
              })}
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

export default TypeDialog;
