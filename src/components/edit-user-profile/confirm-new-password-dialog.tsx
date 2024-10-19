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
import { buttonVariants } from "@/utils/constants";
import { Input } from "@/components/ui/input";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Eye, EyeOff } from "lucide-react";

interface ConfirmNewPasswordDialogProps extends HTMLAttributes<HTMLDivElement> {
  handleDialogAcceptEvent: (value: string) => void;
}

const ConfirmNewPasswordDialog: React.FC<ConfirmNewPasswordDialogProps> = ({
  className,
  ...props
}) => {
  const [value, setValue] = useState<string>();
  const [isDisable, setIsDisable] = useState(true);
  const [visible, setVisible] = useState(false);

  const handleInputEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
    setIsDisable(e.target.value.length === 0);
  };

  const handleConfirm = (value: string) => {
    props.handleDialogAcceptEvent(value);
    setVisible(false);
    setIsDisable(true);
    setValue(undefined);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận mật khẩu mới</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Vui lòng nhập lại mât khẩu mới để xác nhận việc đổi mật khẩu
        </DialogDescription>
        <div className="relative">
          <Input
            type={!visible ? "password" : "text"}
            className="col-span-3 border-slate-300 pr-20 text-xl"
            value={value}
            autoComplete="off"
            onChange={(e) => handleInputEvent(e)}
          />
          <button
            className="absolute text-muted-foreground right-2 bottom-2"
            onClick={(e) => {
              e.preventDefault();
              setVisible((prev) => !prev);
            }}
          >
            {visible ? <EyeOff className="mr-2" /> : <Eye className="mr-2" />}
          </button>
        </div>
        <DialogFooter>
          <DialogClose
            type="submit"
            disabled={isDisable}
            className={buttonVariants({
              variant: isDisable ? "secondary" : "positive",
            })}
            onClick={() => handleConfirm(value!)}
          >
            Lưu
          </DialogClose>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Hủy
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmNewPasswordDialog;
