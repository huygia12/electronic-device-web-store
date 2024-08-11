import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SaleTag from "../ui/saleTag";
import React, { HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { CartItem, Error, ProductFullJoin, ProductItem } from "@/types/api";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  Coins,
  ShoppingBasket,
  Truck,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import Autoplay from "embla-carousel-autoplay";
import { toast } from "sonner";
import { useCartProps } from "@/hooks";
import { buttonVariants } from "@/utils/constants";
import SlideShow from "./slide-show";
import productService from "@/utils/product";

interface CardProductProps extends HTMLAttributes<HTMLDivElement> {
  product: ProductFullJoin;
}

const CardProduct: React.FC<CardProductProps> = ({ className, ...props }) => {
  const { itemsInLocal, setItemsInLocal } = useCartProps();
  const [currentItem, setCurrentItem] = useState<ProductItem>(
    props.product.productItems[0]
  );
  const [quantityError, setQuantityError] = useState<Error>({ success: true });
  const [inputQuantity, setInputQuantity] = useState(1);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const checkDisableButton = () => {
    return quantityError.success && currentItem.quantity > 0;
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
      bucket.push({
        productName: props.product.productName,
        price: currentItem.price,
        quantity: inputQuantity,
        discount: currentItem.discount,
        productCode: currentItem.productCode,
        color: currentItem.color,
        storage: currentItem.storage,
        thump: currentItem.thump,
        productID: props.product.productID,
        itemID: currentItem.itemID,
        height: props.product.height,
        length: props.product.length,
        width: props.product.width,
        weight: props.product.weight,
      });
    toast.success("Thêm vào giỏ hàng thành công!");
    setItemsInLocal(bucket);
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

  return (
    <Card
      className={cn(
        "p-2.5 shadow-xl transition ease-out duration-300 hover_scale-105 relative flex flex-col justify-between h-full",
        className
      )}
    >
      <NavLink
        to={"/products/" + props.product.productID}
        unstable_viewTransition
      >
        <img src={props.product.productItems[0].thump} alt="machine" />
        <CardHeader className="p-1.5 mt-2">
          <CardTitle className="text-[1.1rem] hover_underline hover_text-primary-foreground">
            {props.product.productName}
          </CardTitle>
        </CardHeader>
      </NavLink>
      <CardContent className="p-2">
        <div className="flex flex-row flex-wrap items-baseline justify-between">
          <div className="text-[1.3rem] font-extrabold text-primary-foreground truncate ...">
            {`${productService
              .afterDiscount(
                Number(props.product.productItems[0].price),
                Number(props.product.productItems[0].discount)
              )
              .toLocaleString()}đ`}
          </div>
          {productService.isDiscount(
            props.product.productItems[0].discount
          ) && (
            <del className="text-[0.8rem] text-secondary-foreground">
              {`${props.product.productItems[0].price.toLocaleString()}đ`}
            </del>
          )}
        </div>
        {props.product.productItems[0].discount && (
          <SaleTag
            percentage={`-${props.product.productItems[0].discount}%`}
            className="absolute top-0 left-[-1rem]"
          />
        )}
        <div className="w-full flex items-center justify-around mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="neutral" onClick={() => {}}>
                <ShoppingBasket />
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-max">
              <DialogHeader>
                <DialogTitle>
                  <span className="flex pb-4 gap-2 items-baseline">
                    <h1 className="text-3xl font-bold">
                      {props.product.productName}
                    </h1>
                    <span className=" text-slate-500 text-[0.8rem]">{`(No.${currentItem.productCode})`}</span>
                  </span>
                </DialogTitle>
              </DialogHeader>
              <section className="grid grid-cols-2 gap-10">
                {/** LEFT SECTION */}
                <div className="flex flex-col justify-center bg-red-00">
                  <Carousel
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.play}
                    className="w-[40rem] mb-16"
                  >
                    <CarouselContent>
                      {currentItem.itemImages.map((image, index) => {
                        return (
                          <SlideShow
                            src={image.source}
                            key={index}
                            alt={image.imageID}
                          />
                        );
                      })}
                    </CarouselContent>
                    <CarouselPrevious className="z-10 top-[13rem] left-0 h-[3rem] w-[3rem] !text-secondary-foreground hover_border-primary" />
                    <CarouselNext className="z-10 top-[13rem] right-0 h-[3rem] w-[3rem] !text-secondary-foreground hover_border-primary" />
                  </Carousel>

                  <div className="mb-8 flex ml-4">
                    <span className="flex items-center text-[0.8rem] mr-10">
                      <BadgeCheck className="text-primary mr-2" />
                      Hàng chính hãng - Bảo hành {props.product.warranty} tháng
                    </span>
                    <span className="flex items-center text-[0.8rem]">
                      <Truck className="text-primary mr-2" />
                      Miễn phí vận chuyển với đơn hàng trên 500k
                    </span>
                  </div>
                </div>

                {/** RIGHT SECTION */}
                <div>
                  <div className="flex justify-between items-baseline mb-12 pb-4 border-b-2 border-dashed border-slate-300">
                    <div className="space-x-4">
                      <span className="text-3xl font-semibold text-primary-foreground">{`${currentItem ? productService.afterDiscount(currentItem?.price, currentItem.discount ?? 0).toLocaleString() : 0}đ`}</span>
                      <del className="text-slate-500">{`${currentItem ? currentItem?.price.toLocaleString() : 0}đ`}</del>
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

                  <form>
                    <div className="text-lg font-semibold my-2">
                      Chọn sản phẩm:
                    </div>
                    <ScrollArea className="h-44 mb-8">
                      <ul className="width-full grid grid-cols-2 gap-1 mb-10">
                        {props.product.productItems.map((item, index) => {
                          return (
                            <li
                              key={index}
                              className={cn(
                                "flex flex-row items-center justify-around p-2 rounded-md hover_bg-slate-200",
                                currentItem &&
                                  currentItem.itemID === item.itemID
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
                                    className="text-xl font-medium truncate"
                                  >
                                    {`${productService.afterDiscount(item.price, item.discount ?? 0).toLocaleString()}đ`}
                                  </label>
                                </span>
                                <span className="truncate">{`${item.storage} | ${item.color}`}</span>
                              </span>
                              <img
                                src={item.thump}
                                alt={item.itemID}
                                className="h-[4rem] max-w-[5rem] border-secondary-foreground border-2 rounded-md"
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </ScrollArea>

                    <Label htmlFor="quantity" className="text-lg font-semibold">
                      Số lượng:
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      className="max-w-24 mt-2"
                      min={1}
                      max={currentItem.quantity > 1 ? currentItem.quantity : 1}
                      defaultValue={1}
                      onChange={(e) => handleQuantityInput(e)}
                    />
                    {quantityError && !quantityError.success && (
                      <div className="text-red-600 mt-4">
                        {quantityError.message}
                      </div>
                    )}
                    <DialogClose
                      className={cn(
                        "mt-14 w-full flex items-center text-[1.2rem] min-h-12",
                        buttonVariants({ variant: "neutral" })
                      )}
                      disabled={!checkDisableButton()}
                      onClick={(e) => handleAddToCart(e)}
                    >
                      <ShoppingBasket /> &nbsp; Thêm vào giỏ hàng
                    </DialogClose>
                  </form>
                </div>
              </section>
            </DialogContent>
          </Dialog>

          <Button variant="negative" className="flex gap-2 items-center">
            <Coins />
            Mua ngay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardProduct;
