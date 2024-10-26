import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cartService } from "@/services";
import { Separator } from "@/components/ui/separator";
import { FC, HTMLAttributes } from "react";
import { useCartProps, useCustomNavigate } from "@/hooks";
import { Button } from "@/components/ui/button";

const Bill: FC<HTMLAttributes<HTMLDivElement>> = () => {
  const { itemsInLocal } = useCartProps();
  const { navigate } = useCustomNavigate();

  const handleNextStepEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    navigate("/cart/checkout", {
      unstable_viewTransition: true,
    });
  };

  return (
    <Card className="rounded-md shadow-md">
      <CardHeader className="px-4">
        <CardTitle className="mb-4">ĐƠN HÀNG</CardTitle>
        <CardDescription>
          Quý khách vui lòng nhập thông tin giao hàng ở bước tiếp theo.
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
        <div className="flex justify-between">
          <span>Tiền giảm giá</span>
          <del>
            {cartService.getTotalDiscountAmount(itemsInLocal).toLocaleString() +
              "đ"}
          </del>
        </div>
        <Separator className="border-dashed" />
        <div className="flex justify-between items-center font-semibold">
          <span className="text-primary text-base">Tổng thanh toán</span>
          <span>
            {(
              cartService.getTotalAmount(itemsInLocal) -
              cartService.getTotalDiscountAmount(itemsInLocal)
            ).toLocaleString() + "đ"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="mt-4 px-4">
        <Button
          variant="neutral"
          disabled={itemsInLocal.length === 0}
          className="ml-auto"
          onClick={handleNextStepEvent}
        >
          Đặt hàng
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Bill;
