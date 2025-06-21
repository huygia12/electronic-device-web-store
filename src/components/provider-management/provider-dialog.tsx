import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HTMLAttributes, useState } from "react";
import { Provider } from "@/types/model";
import { buttonVariants } from "@/utils/constants";

interface ProviderDialogProps extends HTMLAttributes<HTMLFormElement> {
  provider?: Provider;
  dialogTitle: string;
  handleDialogAcceptEvent: (name: string) => void;
}

const ProviderDialog: React.FC<ProviderDialogProps> = ({
  className,
  ...props
}) => {
  const [name, setName] = useState<string>(props.provider?.providerName ?? "");
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
    setName(props.provider?.providerName ?? "");
  };

  return (
    <form>
      <Dialog>
        <DialogTrigger asChild onClick={() => resetInputValue()}>
          {props.children}
        </DialogTrigger>
        <DialogContent className="px-2 sms_px-6">
          <DialogHeader>
            <DialogTitle>{props.dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 items-center gap-4">
            <Label
              htmlFor="name"
              className="col-span-2 text-right text-lg text-nowrap"
            >
              Nhà sản xuất
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

export default ProviderDialog;
