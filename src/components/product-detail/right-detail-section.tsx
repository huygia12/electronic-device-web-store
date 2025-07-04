import { Product, ProductItem } from "@/types/model";
import { FC, HTMLAttributes, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleX, Coins, ShoppingBasket } from "lucide-react";
import { cartService, productService } from "@/services";
import { Input } from "@/components/ui/input";
import { useCartProps, useCustomNavigate } from "@/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { applyDiscount, isDiscount } from "@/utils/helpers";
import RelatedProducts from "./related-products";
import { Error } from "@/types/component";

interface RightProductDetailSectionProps
  extends HTMLAttributes<HTMLHeadElement> {
  product: Product;
  currentItem: ProductItem;
  setCurrentItem: (item: ProductItem) => void;
  relatedProducts?: Product[];
}

const RightProductDetailSection: FC<RightProductDetailSectionProps> = ({
  ...props
}) => {
  const { itemsInLocal, setItemsInLocal } = useCartProps();
  const [inputQuantity, setInputQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState<Error>({ success: true });
  const { navigate } = useCustomNavigate();
  const quantityValidation = useMemo(
    () => quantityError.success && props.currentItem.quantity > 0,
    [quantityError, props.currentItem]
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (inputQuantity > props.currentItem.quantity) {
      setQuantityError({ success: false, message: "Số lượng không đủ!" });
      return;
    }

    const addResult = cartService.handleAddToCart(
      props.currentItem,
      inputQuantity,
      itemsInLocal
    );

    addResult.checkExisted ||
      addResult.newCartItems.push(
        productService.convertProductToCartItem(
          props.product,
          props.currentItem,
          inputQuantity
        )
      );
    toast.success("Thêm vào giỏ hàng thành công!");
    setItemsInLocal(addResult.newCartItems);
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

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(
      `/cart/checkout?productID=${props.currentItem.productID}&itemID=${props.currentItem.itemID}&quantity=${inputQuantity}`,
      { unstable_viewTransition: true }
    );
  };

  return (
    <section>
      {/** Tilte and price */}
      <div className="flex flex-col gap-2 lgg_flex-row justify-between items-baseline pb-4 border-b-2 border-dashed border-slate-300">
        <div className="flex flex-col sms_flex-row sms_gap-2 items-baseline">
          <span className="text-2xl md_text-3xl font-semibold text-primary-foreground">{`${props.currentItem ? applyDiscount(props.currentItem?.price, props.currentItem.discount ?? 0).toLocaleString() : 0}đ`}</span>
          {isDiscount(props.currentItem.discount) && (
            <del className="text-secondary-foreground">
              {`${props.currentItem.price.toLocaleString()}đ`}
            </del>
          )}
        </div>
        <div className="flex gap-2">
          {props.currentItem?.quantity ? "Còn hàng" : "Hết hàng"}
          {props.currentItem?.quantity ? (
            <CircleCheck className="text-green-500 " />
          ) : (
            <CircleX className="text-red-500" />
          )}
        </div>
      </div>

      {/** Product items selection and quantity input */}
      <form className="mt-4">
        <Label className="text-lg font-semibold my-2">Chọn sản phẩm:</Label>
        <div className="width-full grid grid-cols-2 sms_grid-cols-1 lg_grid-cols-2 gap-1 mb-10">
          {props.product.productItems.map((item, index) => {
            return (
              <span
                key={index}
                className={cn(
                  "gap-2 flex flex-col xss_flex-row items-center justify-around p-2 rounded-md hover_bg-slate-200 sms_w-fit lg_w-full",
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
                      className="text-sm md_text-xl font-medium truncate"
                    >
                      {`${applyDiscount(item.price, item.discount).toLocaleString()}đ`}
                    </label>
                  </span>
                  <span className="truncate text-xs md_text-base">{`${item.storage} | ${item.color}`}</span>
                </span>
                <img
                  src={item.thump}
                  alt={item.itemID}
                  className="size-14 border-secondary-foreground border-2 rounded-md"
                />
              </span>
            );
          })}
        </div>

        <div className="text-sm md_text-lg space-y-2">
          <Label htmlFor="quantity" className="text-lg font-semibold">
            Số lượng:
          </Label>
          <Input
            id="quantity"
            type="number"
            className="w-20"
            min={1}
            max={
              props.currentItem.quantity > 1 ? props.currentItem.quantity : 1
            }
            defaultValue={1}
            onChange={(e) => handleQuantityInput(e)}
          />
          {quantityError && !quantityError.success && (
            <div className="text-red-600 mt-4">{quantityError.message}</div>
          )}
          <div className="mt-14 w-full grid-cols-2 grid sms_grid-cols-1 sm_grid-cols-2 gap-1">
            <Button
              variant="neutral"
              disabled={!quantityValidation}
              className="flex items-center text-sm md_text-xl !p-1"
              onClick={(e) => handleAddToCart(e)}
            >
              <ShoppingBasket /> &nbsp; Thêm vào giỏ
            </Button>
            <Button
              variant="negative"
              disabled={!quantityValidation}
              className="flex items-center text-sm md_text-xl !p-1"
              onClick={(e) => handleBuyClick(e)}
            >
              <Coins /> &nbsp; Mua ngay
            </Button>
          </div>
        </div>
      </form>

      {/** Related products */}
      <RelatedProducts
        products={props.relatedProducts}
        className="mt-10 hidden sms_block"
      />
    </section>
  );
};

export default RightProductDetailSection;
