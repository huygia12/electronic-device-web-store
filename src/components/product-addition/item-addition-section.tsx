import { FC, HTMLAttributes } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import ImageOverView from "@/components/common/image-overview";
import { retrieveImageUrl } from "@/utils/helpers";
import {
  ProductAttributesFormProps,
  ProductInputFormProps,
  ProductItemsFormProps,
} from "@/utils/schema";

interface ItemAdditionProps extends HTMLAttributes<HTMLUListElement> {
  itemQuantity: number;
  register: UseFormRegister<ProductInputFormProps>;
  errors: FieldErrors<ProductInputFormProps>;
  productItemsAddition: ProductItemsFormProps;
  productAttributesAddition: ProductAttributesFormProps;
}

const ItemAdditionSection: FC<ItemAdditionProps> = ({ ...props }) => {
  return (
    <ul className="mb-8">
      {Array.from({ length: props.itemQuantity }).map((_, parentIndex) => {
        return (
          <li
            key={parentIndex}
            className="grid grid-cols-2 gap-8 border-stone-200 border-2 rounded-xl p-5 mt-10"
          >
            <div className="flex flex-col gap-2">
              <Label
                htmlFor={`thump-${parentIndex}`}
                className="text-lg font-extrabold"
              >
                Ảnh tiêu đề
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                {...props.register(
                  `productItems.${parentIndex}.thump` as const
                )}
                type="file"
                id={`thump-${parentIndex}`}
                accept="image/*"
              />
              {props.errors.productItems?.[parentIndex]?.thump && (
                <div className="text-red-600 pt-2">
                  {`${props.errors.productItems?.[parentIndex]?.thump?.message}`}
                </div>
              )}
              {props.productItemsAddition[parentIndex]?.thump?.[0] && (
                <ImageOverView
                  src={retrieveImageUrl(
                    props.productItemsAddition[parentIndex].thump[0]
                  )}
                  alt={`thump-${parentIndex}`}
                >
                  <img
                    src={retrieveImageUrl(
                      props.productItemsAddition[parentIndex].thump[0]
                    )}
                    className="cursor-pointer max-w-40 object-cover rounded-md border-stone-300 border-2"
                  />
                </ImageOverView>
              )}
            </div>
            <div className="overflow-auto flex flex-col gap-2">
              <Label
                htmlFor={`product-imgs-${parentIndex}`}
                className="text-lg font-extrabold"
              >
                Ảnh sản phẩm
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                {...props.register(
                  `productItems.${parentIndex}.itemImages` as const
                )}
                type="file"
                id={`product-imgs-${parentIndex}`}
                multiple
                accept="image/*"
              />
              {props.errors.productItems?.[parentIndex]?.itemImages && (
                <div className="text-red-600 pt-2">
                  {`${props.errors.productItems?.[parentIndex]?.itemImages?.message}`}
                </div>
              )}
              {props.productItemsAddition[parentIndex]?.itemImages && (
                <div className="overflow-auto flex flex-row gap-2 ">
                  {Array.from(
                    props.productItemsAddition[parentIndex].itemImages
                  ).map((image, index) => {
                    return (
                      <ImageOverView
                        key={index}
                        src={retrieveImageUrl(image)}
                        alt={`productimage-${index}`}
                      >
                        <img
                          src={retrieveImageUrl(image)}
                          className="max-w-40 object-cover rounded-md border-stone-300 border-2"
                        />
                      </ImageOverView>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`price-${parentIndex}`}
                  className="text-lg font-extrabold"
                >
                  Giá tiền(VNĐ)
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  {...props.register(
                    `productItems.${parentIndex}.price` as const
                  )}
                  id={`price-${parentIndex}`}
                  type="number"
                  autoComplete={"off"}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {props.errors.productItems?.[parentIndex]?.price && (
                  <div className="text-red-600 pt-2">
                    {`${props.errors.productItems?.[parentIndex]?.price?.message}`}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={`quantity-${parentIndex}`}
                  className="text-lg font-extrabold"
                >
                  Số lượng
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  {...props.register(
                    `productItems.${parentIndex}.quantity` as const
                  )}
                  min={1}
                  max={1000000000}
                  id={`quantity-${parentIndex}`}
                  type="number"
                  autoComplete={"off"}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {props.errors.productItems?.[parentIndex]?.quantity && (
                  <div className="text-red-600 pt-2">
                    {`${props.errors.productItems?.[parentIndex]?.quantity?.message}`}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={`code-${parentIndex}`}
                  className="text-lg font-extrabold"
                >
                  Mã sản phẩm
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  {...props.register(
                    `productItems.${parentIndex}.productCode` as const
                  )}
                  id={`code-${parentIndex}`}
                  type="text"
                  autoComplete={"off"}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {props.errors.productItems?.[parentIndex]?.productCode && (
                  <div className="text-red-600 pt-2">
                    {`${props.errors.productItems?.[parentIndex]?.productCode?.message}`}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor={`discount-${parentIndex}`}
                  className="text-lg font-extrabold"
                >
                  Giảm giá(%)
                </Label>
                <Input
                  {...props.register(
                    `productItems.${parentIndex}.discount` as const
                  )}
                  id={`discount-${parentIndex}`}
                  max={100}
                  min={0}
                  defaultValue={0}
                  type="number"
                  autoComplete={"off"}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {props.errors.productItems?.[parentIndex]?.discount && (
                  <div className="text-red-600 pt-2">
                    {`${props.errors.productItems?.[parentIndex]?.discount?.message}`}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={`color-${parentIndex}`}
                  className="text-lg font-extrabold"
                >
                  Màu
                  <span className="text-red-600 ">*</span>
                </Label>
                <Input
                  {...props.register(
                    `productItems.${parentIndex}.color` as const
                  )}
                  id={`color-${parentIndex}`}
                  type="text"
                  autoComplete={"off"}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {props.errors.productItems?.[parentIndex]?.color && (
                  <div className="text-red-600 pt-2">
                    {`${props.errors.productItems?.[parentIndex]?.color?.message}`}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor={`capacity-${parentIndex}`}
                  className="text-lg font-extrabold"
                >
                  Dung lượng
                </Label>
                <Input
                  {...props.register(
                    `productItems.${parentIndex}.storage` as const
                  )}
                  id={`capacity-${parentIndex}`}
                  type="text"
                  autoComplete={"off"}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {props.errors.productItems?.[parentIndex]?.storage && (
                  <div className="text-red-600 pt-2">
                    {`${props.errors.productItems?.[parentIndex]?.storage?.message}`}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ItemAdditionSection;
