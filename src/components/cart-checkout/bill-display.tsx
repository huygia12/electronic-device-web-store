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
import { FC, HTMLAttributes } from "react";
import { cartService } from "@/services";
import { useCartProps } from "@/hooks";
import { Nullable } from "@/utils/declare";

interface BillDisplayProps extends HTMLAttributes<HTMLDivElement> {
  shippingFee: Nullable<number>;
  shippingTime: number;
  totalMoney: number;
}

const BillDisplay: FC<BillDisplayProps> = ({ ...props }) => {
  const { itemsInLocal } = useCartProps();

  return (
    <section className="rounded-md">
      <Card>
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
            <span>
              {cartService.getTotalAmount(itemsInLocal).toLocaleString() + "đ"}
            </span>
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
            <span>Tổng tiền giảm giá</span>
            <del>
              {cartService
                .getTotalDiscountAmount(itemsInLocal)
                .toLocaleString() + "đ"}
            </del>
          </div>
          <Separator className="border-dashed" />
          <div className="flex justify-between items-center font-semibold">
            <span className="text-primary text-xl">Tổng thanh toán</span>
            <span>{props.totalMoney.toLocaleString() + "đ"}</span>
          </div>
        </CardContent>
        <CardFooter className="mt-4 px-4 flex flex-col">
          <Button
            type="submit"
            variant="neutral"
            disabled={itemsInLocal.length === 0}
            className="w-full"
          >
            Hoàn thành đơn hàng
          </Button>
          {props.shippingFee && (
            <div className="mt-10 text-[0.8rem] ">
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

export default BillDisplay;
