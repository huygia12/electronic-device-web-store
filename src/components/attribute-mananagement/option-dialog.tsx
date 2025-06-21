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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AttributeOption } from "@/types/model";
import { buttonVariants } from "@/utils/constants";

interface AttibuteDialogProps extends HTMLAttributes<HTMLFormElement> {
  option?: AttributeOption;
  formTitle: string;
  handleDialogAcceptEvent: (name: string) => void;
}

const OptionDialog: React.FC<AttibuteDialogProps> = ({
  className,
  ...props
}) => {
  const [name, setName] = useState<string>(props.option?.optionID ?? "");
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
    setName(props.option?.optionValue ?? "");
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
              Giá trị
            </Label>
            <Input
              id="name"
              value={name}
              type="text"
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

export default OptionDialog;
