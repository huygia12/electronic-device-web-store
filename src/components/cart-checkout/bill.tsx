import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { convertMiliSecToDays } from "@/utils/helpers";
import { Separator } from "@/components/ui/separator";
import { FC, HTMLAttributes, useMemo } from "react";
import { cartService } from "@/services";
import { CartItem } from "@/types/model";
import { cn } from "@/lib/utils";

interface BillProps extends HTMLAttributes<HTMLDivElement> {
  cartItems: CartItem[] | undefined;
  shippingFee: number | null;
  shippingTime: number | null;
  totalMoney: number;
}

const Bill: FC<BillProps> = ({ ...props }) => {
  const buyButtonDisability = useMemo(
    () => !props.cartItems || props.cartItems.length === 0,
    [props.cartItems]
  );
  const totalBillAmount = useMemo(
    () => (props.cartItems ? cartService.getTotalAmount(props.cartItems) : 0),
    [props.cartItems]
  );
  const totalDiscountAmount = useMemo(
    () =>
      props.cartItems ? cartService.getTotalDiscountAmount(props.cartItems) : 0,
    [props.cartItems]
  );

  return (
    <section className={cn("rounded-md", props.className)}>
      <Card className="shadow-lg">
        <CardHeader className="px-4">
          <CardTitle className="mb-4">ĐƠN HÀNG</CardTitle>
          <CardDescription>
            Thông tin giao hàng sẽ được tiếp nhận bởi dịch vụ chuyển phát GHN.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <Separator className="border-dashed" />
          <div className="flex justify-between">
            <span>Tổng tiền hàng</span>
            <span>{totalBillAmount.toLocaleString() + "đ"}</span>
          </div>
          {props.shippingFee && (
            <>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{props.shippingFee.toLocaleString() + "đ"}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span>Tiền giảm giá</span>
            <del>{totalDiscountAmount.toLocaleString() + "đ"}</del>
          </div>
          <Separator className="border-dashed" />
          <div className="flex justify-between items-center font-semibold">
            <span className="text-primary text-base">Tổng thanh toán</span>
            <span>{props.totalMoney.toLocaleString() + "đ"}</span>
          </div>
        </CardContent>
        <CardFooter className="mt-4 px-4 flex flex-col">
          <Button
            type="submit"
            variant="neutral"
            disabled={buyButtonDisability}
            className="w-full"
          >
            Hoàn thành đơn hàng
          </Button>
          {props.shippingTime != null && (
            <div className="mt-5 text-[0.8rem] ">
              <span className="font-semibold">
                <span className="text-red-600 ">*</span>
                Ghi chú:
              </span>
              <span>
                {` đảm bảo nhận hàng trong vòng ${convertMiliSecToDays(props.shippingTime)} ngày.`}
              </span>
            </div>
          )}
        </CardFooter>
      </Card>
    </section>
  );
};

export default Bill;
