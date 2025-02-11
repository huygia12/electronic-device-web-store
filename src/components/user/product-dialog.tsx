import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  ShoppingBasket,
  Truck,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/utils/constants";
import SlideShow from "./slide-show";
import { productService } from "@/services";
import { CartItem, Product, ProductItem } from "@/types/model";
import { HTMLAttributes, useRef, useState } from "react";
import { toast } from "sonner";
import { useCartProps } from "@/hooks";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { applyDiscount, isDiscount } from "@/utils/helpers";
import { Error } from "@/types/component";
import { NavLink } from "react-router-dom";

interface ProductDialogProps extends HTMLAttributes<HTMLDivElement> {
  product: Product;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  className,
  children,
  ...props
}) => {
  const { itemsInLocal, setItemsInLocal } = useCartProps();
  const [quantityError, setQuantityError] = useState<Error>({ success: true });
  const [currentItem, setCurrentItem] = useState<ProductItem>(
    props.product.productItems[0]
  );
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [inputQuantity, setInputQuantity] = useState(1);

  const checkDisableButton = () => {
    return quantityError.success && currentItem.quantity > 0;
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const value = Number(e.target.value);
    if (value < 1) {
      setQuantityError({ success: false, message: "Số lượng không hợp lệ!" });
      return;
    }
    setInputQuantity(value);
    setQuantityError({ success: true });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (inputQuantity > currentItem.quantity) {
      setQuantityError({ success: false, message: "Số lượng không đủ!" });
      return;
    }

    let checkExisted: boolean = false;
    const bucket: CartItem[] = itemsInLocal.map((i) => i);

    bucket.map((item) => {
      if (
        item.itemID === currentItem.itemID &&
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
          currentItem,
          inputQuantity
        )
      );
    toast.success("Thêm vào giỏ hàng thành công!");
    setItemsInLocal(bucket);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-full lg_min-w-lg 3xl_min-w-2xl p-2 mlg_p-6">
        <DialogHeader>
          <DialogTitle>
            <NavLink
              to={`/products/${props.product.productID}`}
              className="flex gap-2 items-baseline flex-col xs_flex-row"
            >
              <h2 className="text-xl md_text-2xl font-bold cursor-pointer hover_underline">
                {props.product.productName}
              </h2>
              <span className=" text-slate-500 text-xs md_text-[0.8rem]">{`(No.${currentItem.productCode})`}</span>
            </NavLink>
          </DialogTitle>
        </DialogHeader>
        <section className="grid grid-cols-2 gap-10 items-start">
          {/** LEFT SECTION */}
          <div className="flex flex-col justify-center">
            <Carousel
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.play}
              className="w-fit mb-10"
            >
              <CarouselContent className="h-full">
                {currentItem.itemImages.map((image, index) => {
                  return (
                    <SlideShow
                      src={image.source}
                      key={index}
                      alt={image.imageID}
                      imageCss="h-full max-h-[70vh]"
                    />
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="z-10 top-[50%] left-1 size-8 sm_size-10 lgg_size-12 !text-secondary-foreground hover_border-primary" />
              <CarouselNext className="z-10 top-[50%] right-1 size-8 sm_size-10 lgg_size-12 !text-secondary-foreground hover_border-primary" />
            </Carousel>

            <div className="flex gap-4 flex-col xl_flex-row">
              <span className="flex items-center text-[0.8rem] 3xl_text-nowrap">
                <BadgeCheck className="text-primary mr-2" />
                Hàng chính hãng - Bảo hành {props.product.warranty} tháng
              </span>
              <span className="flex items-center text-[0.8rem] 3xl_text-nowrap">
                <Truck className="text-primary mr-2" />
                Miễn phí vận chuyển với đơn hàng trên 500k
              </span>
            </div>
          </div>

          {/** RIGHT SECTION */}
          <div>
            <div className="flex flex-col gap-2 lgg_flex-row justify-between items-baseline pb-4 border-b-2 border-dashed border-slate-300">
              <div className="flex flex-col sms_flex-row sms_gap-2 items-baseline">
                <span className="text-2xl md_text-3xl font-semibold text-primary-foreground">{`${currentItem ? applyDiscount(currentItem?.price, currentItem.discount ?? 0).toLocaleString() : 0}đ`}</span>
                {isDiscount(currentItem.discount) && (
                  <del className="text-secondary-foreground">
                    {`${currentItem.price.toLocaleString()}đ`}
                  </del>
                )}
              </div>
              <div className="flex gap-2">
                {currentItem?.quantity ? "Còn hàng" : "Hết hàng"}
                {currentItem?.quantity ? (
                  <CircleCheck className="text-green-500 " />
                ) : (
                  <CircleX className="text-red-500" />
                )}
              </div>
            </div>

            <form className="mt-4">
              <div className="text-lg font-semibold my-2">Chọn sản phẩm:</div>
              <ScrollArea className="h-32 sms_h-44 mb-4">
                <ul className="width-full grid grid-cols-1 lg_grid-cols-2 gap-1 mb-10">
                  {props.product.productItems.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className={cn(
                          "w-fit gap-2 flex flex-col xss_flex-row items-center justify-around p-2 rounded-md hover_bg-slate-200",
                          currentItem && currentItem.itemID === item.itemID
                            ? "bg-slate-200"
                            : "bg-slate-100"
                        )}
                      >
                        <span className="flex flex-col items-center">
                          <span className="space-x-2">
                            <Checkbox
                              onClick={() => setCurrentItem(item)}
                              checked={
                                currentItem &&
                                currentItem.itemID === item.itemID
                              }
                              id={index + ""}
                              className="border-2 w-5 h-5 !text-white"
                            />
                            <label
                              htmlFor={index + ""}
                              className="text-sm md_text-xl font-medium truncate"
                            >
                              {`${applyDiscount(item.price, item.discount ?? 0).toLocaleString()}đ`}
                            </label>
                          </span>
                          <span className="truncate text-xs md_text-base">{`${item.storage} | ${item.color}`}</span>
                        </span>

                        <img
                          src={item.thump}
                          alt={item.itemID}
                          className="size-14 border-secondary-foreground border-2 rounded-md"
                        />
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>

              <div className="text-sm md_text-lg space-y-2">
                <Label htmlFor="quantity" className="font-semibold">
                  Số lượng:
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  className="w-20"
                  min={1}
                  max={currentItem.quantity > 1 ? currentItem.quantity : 1}
                  defaultValue={1}
                  onChange={(e) => handleQuantityInput(e)}
                />
                {quantityError && !quantityError.success && (
                  <div className="text-red-600">{quantityError.message}</div>
                )}
                <DialogClose
                  className={cn(
                    "w-full flex text-sm md_text-xl !p-1",
                    buttonVariants({ variant: "neutral" })
                  )}
                  disabled={!checkDisableButton()}
                  onClick={(e) => handleAddToCart(e)}
                >
                  <ShoppingBasket className="mr" /> &nbsp; Thêm vào giỏ
                </DialogClose>
              </div>
            </form>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
