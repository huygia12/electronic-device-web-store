import { CartItem, Error, ProductFullJoin, ProductItem } from "@/types/api";
import { FC, HTMLAttributes, useState } from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX, Coins, ShoppingBasket } from "lucide-react";
import productService from "@/utils/product";
import { Input } from "../ui/input";
import { useCartProps } from "@/hooks";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

interface RightProductDetailSectionProps
  extends HTMLAttributes<HTMLHeadElement> {
  product: ProductFullJoin;
  currentItem: ProductItem;
  setCurrentItem: (item: ProductItem) => void;
}

const RightProductDetailSection: FC<RightProductDetailSectionProps> = ({
  ...props
}) => {
  const { itemsInLocal, setItemsInLocal } = useCartProps();
  const [inputQuantity, setInputQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState<Error>({ success: true });

  const checkDisableButton = () => {
    return quantityError.success && props.currentItem.quantity > 0;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (inputQuantity > props.currentItem.quantity) {
      setQuantityError({ success: false, message: "Số lượng không đủ!" });
      return;
    }

    let checkExisted: boolean = false;
    const bucket: CartItem[] = itemsInLocal.map((i) => i);

    bucket.map((item) => {
      if (
        item.itemID === props.currentItem.itemID &&
        item.productID === props.product.productID
      ) {
        item.quantity += inputQuantity;
        checkExisted = true;
      }
    });

    checkExisted ||
      bucket.push(
        productService.convertProductToCartItem(
          props.product,
          props.currentItem,
          inputQuantity
        )
      );
    toast.success("Thêm vào giỏ hàng thành công!");
    setItemsInLocal(bucket);
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const value = Number(e.target.value);
      if (value < 1) {
        setQuantityError({ success: false, message: "Số lượng không hợp lệ!" });
        return;
      }
      setInputQuantity(value);
      setQuantityError({ success: true });
    } catch (error) {
      setQuantityError({ success: false, message: "Số lượng không hợp lệ!" });
    }
  };

  return (
    <section>
      <div className="flex justify-between items-baseline mb-12 pb-4 border-b-2 border-dashed border-slate-300">
        <div className="space-x-4">
          <span className="text-3xl font-semibold text-primary-foreground">{`${props.currentItem ? productService.afterDiscount(props.currentItem.price, props.currentItem.discount ?? 0).toLocaleString() : 0}đ`}</span>
          <del className="text-slate-500">{`${props.currentItem ? props.currentItem?.price.toLocaleString() : 0}đ`}</del>
        </div>
        <div className="flex gap-2">
          {checkDisableButton() ? "Còn hàng" : "Hết hàng"}
          {checkDisableButton() ? (
            <CircleCheck className="text-green-500 " />
          ) : (
            <CircleX className="text-red-500" />
          )}
        </div>
      </div>

      <form>
        <Label className="text-lg font-semibold my-2">Chọn sản phẩm:</Label>
        <div className="width-full grid grid-cols-2 gap-1 mb-10">
          {props.product.productItems.map((item, index) => {
            return (
              <span
                key={index}
                className={cn(
                  "flex flex-row items-center justify-around p-2 rounded-md hover_bg-slate-200",
                  props.currentItem && props.currentItem.itemID === item.itemID
                    ? "bg-slate-200"
                    : "bg-slate-100"
                )}
              >
                <span className="flex flex-col items-center">
                  <span className="space-x-2">
                    <Checkbox
                      onClick={() => props.setCurrentItem(item)}
                      checked={
                        props.currentItem &&
                        props.currentItem.itemID === item.itemID
                      }
                      id={index + ""}
                      className="border-2 w-5 h-5 !text-white"
                    />
                    <label
                      htmlFor={index + ""}
                      className="text-xl font-medium truncate"
                    >
                      {`${productService.afterDiscount(item.price, item.discount).toLocaleString()}đ`}
                    </label>
                  </span>
                  <span className="truncate">{`${item.storage} | ${item.color}`}</span>
                </span>
                <img
                  src={item.thump}
                  alt={item.itemID}
                  className="h-[4rem] max-w-[5rem] border-secondary-foreground border-2 rounded-md"
                />
              </span>
            );
          })}
        </div>
        <Label htmlFor="quantity" className="text-lg font-semibold">
          Số lượng:
        </Label>
        <Input
          id="quantity"
          type="number"
          className="max-w-24 mt-2"
          min={1}
          max={props.currentItem.quantity > 1 ? props.currentItem.quantity : 1}
          defaultValue={1}
          onChange={(e) => handleQuantityInput(e)}
        />
        {quantityError && !quantityError.success && (
          <div className="text-red-600 mt-4">{quantityError.message}</div>
        )}
        <div className="mt-14 w-full grid grid-cols-2 gap-1">
          <Button
            variant="neutral"
            disabled={!checkDisableButton()}
            className="flex items-center text-[1.2rem] min-h-12"
            onClick={(e) => handleAddToCart(e)}
          >
            <ShoppingBasket /> &nbsp; Thêm vào giỏ hàng
          </Button>
          <Button
            variant="negative"
            disabled={!checkDisableButton()}
            className="flex items-center text-[1.2rem] min-h-12"
          >
            <Coins /> &nbsp; Mua ngay
          </Button>
        </div>
      </form>
    </section>
  );
};

export default RightProductDetailSection;
