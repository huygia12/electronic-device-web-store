import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  LocalStorageProductItem,
  Error,
  ProductItem,
  ProductDetail,
  ProductAttribute,
} from "@/types/api";
import { afterDiscount, getProductAttribute } from "@/utils/product";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  Coins,
  ShoppingBasket,
  Star,
  Truck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { useCartProps } from "@/hooks";
import axios from "axios";
import { getAttributes } from "@/services/apis";
import { SlideShow } from "@/components/user";

const ProductDetailPage = () => {
  const { itemsInLocal, setItemsInLocal } = useCartProps();
  const productData = useRouteLoaderData("product_detail") as ProductDetail;
  const [currentItem, setCurrentItem] = useState<ProductItem>(
    productData.items[0]
  );
  const [quantityError, setQuantityError] = useState<Error>({ success: true });
  const [inputQuantity, setInputQuantity] = useState(1);
  const [productAttribute, setProductAttribute] = useState<ProductAttribute[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attributesRes = await getAttributes();

        setProductAttribute(getProductAttribute(productData, attributesRes));
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log("error");
          console.error("Axios error:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchData();
  }, [productData]);

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
    const bucket: LocalStorageProductItem[] = itemsInLocal.map((i) => i);

    bucket.map((item) => {
      if (
        item.itemID === currentItem.itemID &&
        item.productID === productData.productID
      ) {
        item.quantity += inputQuantity;
        checkExisted = true;
      }
    });
    checkExisted ||
      bucket?.push({
        productID: productData.productID,
        itemID: currentItem.itemID,
        quantity: inputQuantity,
      });
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
    <>
      {productData && (
        <div>
          <header className="border-b-2 border-b-slate-200 flex items-baseline justify-between mb-10">
            <span className="flex pb-4 gap-2 items-baseline">
              <h1 className="text-3xl font-bold">{productData.productName}</h1>
              <span className=" text-slate-500 text-[0.8rem]">{`(No.${currentItem.productCode})`}</span>
            </span>
            {/* <span className="flex items-baseline space-x-2">
              <RatingPoint
                rate={getAverageRatingPoint(productData)}
                iconSize={18}
                className="text-yellow-500"
              />
              <span className="text-sm cursor-pointer hover_underline truncate ...">
                {`${productData.reviews.length} đánh giá`}
              </span>
            </span> */}
          </header>
          <section className="grid grid-cols-2 gap-10 mb-10">
            {/** LEFT SECTION */}
            <div className="flex flex-col justify-center bg-red-00">
              <Carousel
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.play}
                className="w-[40rem] mb-16"
              >
                <CarouselContent>
                  {currentItem?.images.map((url, index) => {
                    return <SlideShow src={url} key={index} alt={url} />;
                  })}
                </CarouselContent>
                <CarouselPrevious className="z-10 top-[13rem] left-0 h-[3rem] w-[3rem] !text-secondary-foreground hover_border-primary" />
                <CarouselNext className="z-10 top-[13rem] right-0 h-[3rem] w-[3rem] !text-secondary-foreground hover_border-primary" />
              </Carousel>

              <div className="mb-8 flex ml-4">
                <span className="flex items-center text-[0.8rem] mr-10">
                  <BadgeCheck className="text-primary mr-2" />
                  Hàng chính hãng - Bảo hành {productData.warranty} tháng
                </span>
                <span className="flex items-center text-[0.8rem]">
                  <Truck className="text-primary mr-2" />
                  Miễn phí vận chuyển với đơn hàng trên 500k
                </span>
              </div>

              <div className="border-slate-100 border-2 rounded-xl shadow-lg p-4">
                <h5 className="font-semibold text-[1.2rem] py-4">
                  Thông số thiết bị
                </h5>
                <Table className="border-2 border-slate-200">
                  <TableBody>
                    {productAttribute.map((attr, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {attr.typeValue}
                        </TableCell>
                        <TableCell>{attr.optionName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/** RIGHT SECTION */}
            <div>
              <div className="flex justify-between items-baseline mb-12 pb-4 border-b-2 border-dashed border-slate-300">
                <div className="space-x-4">
                  <span className="text-3xl font-semibold text-primary-foreground">{`${currentItem ? afterDiscount(currentItem?.price, currentItem.discount ?? 0).toLocaleString() : 0}đ`}</span>
                  <del className="text-slate-500">{`${currentItem ? currentItem?.price.toLocaleString() : 0}đ`}</del>
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
                <Label className="text-lg font-semibold my-2">
                  Chọn sản phẩm:
                </Label>
                <div className="width-full grid grid-cols-2 gap-1 mb-10">
                  {productData.items.map((item, index) => {
                    return (
                      <span
                        key={index}
                        className={cn(
                          "flex flex-row items-center justify-around p-2 rounded-md hover_bg-slate-200",
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
                              className="text-xl font-medium truncate"
                            >
                              {`${afterDiscount(item.price, item.discount ?? 0).toLocaleString()}đ`}
                            </label>
                          </span>
                          <span className="truncate">{`${item.storageName} | ${item.colorName}`}</span>
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
                  max={currentItem.quantity > 1 ? currentItem.quantity : 1}
                  defaultValue={1}
                  onChange={(e) => handleQuantityInput(e)}
                />
                {quantityError && !quantityError.success && (
                  <div className="text-red-600 mt-4">
                    {quantityError.message}
                  </div>
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
            </div>
          </section>

          {/** REVIEWS */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="">
              <AccordionTrigger className="bg-theme rounded-tl-md rounded-tr-md p-5 font-semibold">
                Mô Tả Sản Phẩm
              </AccordionTrigger>
              <AccordionContent className="py-4 px-10 !border-x-2 border-slate-200 text-[0.9rem] contain-content">
                {productData.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="bg-theme-softer p-5 font-semibold ">
                Đánh Giá Từ Khách Hàng
              </AccordionTrigger>
              <AccordionContent className="flex flex-col p-4 justify-center border-2 border-slate-100">
                <div className="flex items-center flex-col mb-10">
                  <img src="/reviews.png" alt="review" width={300} />
                  <span className="font-semibold">
                    Sản phẩm hiện chưa có đánh giá nào!
                  </span>
                </div>
                <form className="px-8 py-8 space-y-4 flex flex-col border-2 border-slate-200 rounded-md shadow-md">
                  <div className="flex space-x-2 text-secondary-foreground">
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                  </div>
                  <div>
                    <Label
                      htmlFor="review"
                      className="font-semibold text-[1rem]"
                    >
                      Đánh giá
                    </Label>
                    <Textarea id="review" className="mt-2"></Textarea>
                  </div>
                  <Button variant="negative" className="self-end">
                    Gửi đánh giá
                  </Button>
                </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
