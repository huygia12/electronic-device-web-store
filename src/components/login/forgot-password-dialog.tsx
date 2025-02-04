import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HTMLAttributes, useRef, useState } from "react";
import { buttonVariants } from "@/utils/constants";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { userService } from "@/services";
import { toast } from "sonner";

interface ForgotPasswordDialogProps extends HTMLAttributes<HTMLFormElement> {
  email: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  className,
  ...props
}) => {
  const [otp, setOTP] = useState<string>(``);
  const [error, setError] = useState<string | null>(null);
  const failureCounter = useRef<number>(0);

  const resetInputValue = () => {
    failureCounter.current = 0;
    setOTP("");
    setError(null);
  };

  const handleSendOTPInput = async () => {
    try {
      const result = await userService.apis.verifyOTP(props.email, otp);
      if (result) {
        setError(null);
        toast.success(`Kiểm tra email để biết được mật khẩu mới!`);
      } else {
        failureCounter.current++;
        if (failureCounter.current == 5) {
          toast.error(
            `Đã quá 5 lần nhập sai mã OTP. Tài khoản tạm thời bị khóa!`
          );
          props.setIsOpen(false);
          return;
        }

        setError(`Mã OTP không đúng! Vui lòng nhập lại.`);
        setOTP("");
      }
    } catch (e) {
      setError("Lỗi khi xác thực OTP!");
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogTrigger
        asChild
        onClick={() => resetInputValue()}
        className={className}
      >
        {props.children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nhập mã OTP</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Kiểm tra email được liên kết với tài khoản. Hạn trong vòng 2 phút và
          chỉ được nhập 5 lần.
        </DialogDescription>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={setOTP}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter>
          {error && <span className="text-red-600 mr-4">{error}</span>}
          <button
            onClick={handleSendOTPInput}
            className={buttonVariants({
              variant: "positive",
            })}
          >
            Gửi
          </button>
          <DialogClose className={buttonVariants({ variant: "outline" })}>
            Hủy
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
