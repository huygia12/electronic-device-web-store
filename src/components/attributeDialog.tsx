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
import { HTMLAttributes, useState } from "react";
import { AttributeType } from "@/declare";
import { buttonVariants } from "@/utils/constants";

interface AttibuteDialogProps extends HTMLAttributes<HTMLFormElement> {
  attribute?: AttributeType;
  formTitle: string;
  handleDialogAcceptEvent: (name: string) => Promise<void>;
}

const AttributeDialog: React.FC<AttibuteDialogProps> = ({
  className,
  ...props
}) => {
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
            <DialogTitle>{props.formTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-lg">
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
          <DialogFooter>
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

export default AttributeDialog;
