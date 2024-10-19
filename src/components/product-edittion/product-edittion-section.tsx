import { FC, HTMLAttributes, useState } from "react";
import Badge from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  ProductAttributesFormProps,
  ProductUpdateFormProps,
} from "@/utils/schema";
import { Category, Provider, Attribute } from "@/types/model";
import { Button } from "@/components/ui/button";
import { attributeService } from "@/services";
import { cn } from "@/lib/utils";

interface ProductAdditionSectionProps extends HTMLAttributes<HTMLDivElement> {
  register: UseFormRegister<ProductUpdateFormProps>;
  errors: FieldErrors<ProductUpdateFormProps>;
  categories: Category[];
  providers: Provider[];
  attributes: Attribute[];
  selectedCategory: string | undefined;
  selectedProvider: string | undefined;
  selectedAttribute: Attribute | undefined;
  productAttributesAddition: ProductAttributesFormProps;
  onCategorySelection: (id: string) => void;
  onProviderSelection: (id: string) => void;
  onProductAttributeRemoval: (index: number) => void;
  onAttributeTypeSelection: (attribute: Attribute) => void;
  onAttributeProductAdding: (value: string) => void;
}

const ProductAdditionSection: FC<ProductAdditionSectionProps> = ({
  ...props
}) => {
  const [selectComponentKey, setSelectComponentKey] = useState<number>(1);

  const handleAddProductAttribute = (value: string) => {
    props.onAttributeProductAdding(value);
    setSelectComponentKey(selectComponentKey === 1 ? 2 : 1);
  };

  return (
    <div className="grid grid-cols-2 gap-8 mb-8">
      {/** LEFT */}
      <div className="grid gap-4 grid-cols-3">
        {/** PRODUCT NAME */}
        <div className="space-y-2 col-span-3">
          <Label htmlFor="name" className="text-lg font-extrabold">
            Tên sản phẩm
            <span className="text-red-600 ">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete={"off"}
            {...props.register("productName")}
            placeholder="abc"
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          />
          {props.errors.productName && (
            <div className="text-red-600">
              {props.errors.productName.message}
            </div>
          )}
        </div>
        {/** GURANTEE TIME SPAN */}
        <div className="space-y-2">
          <Label htmlFor="gurantee" className="text-lg font-extrabold">
            Thời hạn bảo hành(tháng)
            <span className="text-red-600 ">*</span>
          </Label>
          <Input
            id="gurantee"
            autoComplete={"off"}
            {...props.register("warranty")}
            type="number"
            min={0}
            className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
          />
          {props.errors.warranty && (
            <div className="text-red-600">{props.errors.warranty.message}</div>
          )}
        </div>
        {/** CATEGORY */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-lg font-extrabold">
            Danh mục
            <span className="text-red-600 ">*</span>
          </Label>
          <Select
            value={props.selectedCategory}
            onValueChange={(value) => props.onCategorySelection(value)}
          >
            <SelectTrigger
              id="category"
              value={props.selectedCategory}
              {...props.register("categoryID")}
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            >
              <SelectValue className="p-0" />
            </SelectTrigger>
            {props.errors.categoryID && (
              <div className="text-red-600">
                {props.errors.categoryID.message}
              </div>
            )}
            <SelectContent>
              {props.categories.map((cate, index) => {
                return (
                  <SelectItem
                    key={index}
                    value={cate.categoryID}
                    className="max-w-[30rem] truncate"
                  >
                    {cate.categoryName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {/** PROVIDER */}
        <div className="space-y-2">
          <Label htmlFor="provider" className="text-lg font-extrabold">
            Nhà phân phối
            <span className="text-red-600 ">*</span>
          </Label>
          <Select
            value={props.selectedProvider}
            onValueChange={(value) => props.onProviderSelection(value)}
          >
            <SelectTrigger
              id="provider"
              value={props.selectedProvider}
              {...props.register("providerID")}
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            >
              <SelectValue className="p-0" />
            </SelectTrigger>
            {props.errors.providerID && (
              <div className="text-red-600">
                {props.errors.providerID.message}
              </div>
            )}
            <SelectContent>
              {props.providers.map((provider, index) => {
                return (
                  <SelectItem
                    key={index}
                    value={provider.providerID}
                    className="max-w-[30rem] truncate"
                  >
                    {provider.providerName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {/** SIZE */}
        <div className="col-span-3 grid grid-cols-4 gap-4">
          {/** LENGTH */}
          <div className="space-y-2">
            <Label htmlFor="length" className="text-lg font-extrabold">
              Dài(cm)
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="length"
              autoComplete={"off"}
              {...props.register("length")}
              min={0}
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            />
            {props.errors.length && (
              <div className="text-red-600">{props.errors.length.message}</div>
            )}
          </div>
          {/** WIDTH */}
          <div className="space-y-2">
            <Label htmlFor="width" className="text-lg font-extrabold">
              Rộng(cm)
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="width"
              autoComplete={"off"}
              {...props.register("width")}
              min={0}
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            />
            {props.errors.width && (
              <div className="text-red-600">{props.errors.width.message}</div>
            )}
          </div>
          {/** HEIGHT */}
          <div className="space-y-2">
            <Label htmlFor="height" className="text-lg font-extrabold">
              Cao(cm)
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="height"
              autoComplete={"off"}
              {...props.register("height")}
              min={0}
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            />
            {props.errors.height && (
              <div className="text-red-600">{props.errors.height.message}</div>
            )}
          </div>
          {/** WEIGHT */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-lg font-extrabold">
              Nặng(gram)
              <span className="text-red-600 ">*</span>
            </Label>
            <Input
              id="weight"
              autoComplete={"off"}
              {...props.register("weight")}
              min={0}
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
            />
            {props.errors.weight && (
              <div className="text-red-600">{props.errors.weight.message}</div>
            )}
          </div>
        </div>
        {/** ATTRIBUTES SELECTION */}
        <div className="col-span-3 grid grid-cols-2 gap-4">
          {/** ATTRIBUTE TYPES */}
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="attributeTypes" className="text-lg font-extrabold">
              Thể loại
            </Label>
            <Popover>
              <PopoverTrigger
                id="attributeTypes"
                asChild
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              >
                <Button
                  variant="normal"
                  role="combobox"
                  className="justify-between focus_!ring-2"
                >
                  {props.selectedAttribute
                    ? props.selectedAttribute.typeValue
                    : "Chọn thể loại..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-max p-0 cursor-pointer">
                <Command>
                  <CommandInput
                    placeholder="Tìm thể loại..."
                    className="text-lg"
                  />
                  <CommandList>
                    <CommandEmpty className="text-stone-500 text-center p-4">
                      Không tìm thấy.
                    </CommandEmpty>
                    <CommandGroup>
                      {attributeService
                        .getAvailableAttributes(
                          props.attributes,
                          props.productAttributesAddition
                        )
                        .map((attribute, index) => (
                          <CommandItem
                            key={index}
                            value={attribute.typeValue}
                            onSelect={() =>
                              props.onAttributeTypeSelection(attribute)
                            }
                            className="text-lg cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                props.selectedAttribute?.typeID ===
                                  attribute.typeID
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {attribute.typeValue}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {/** ATTRIBUTE OPTIONS */}
          <div className="space-y-2">
            <Label
              htmlFor="attributeOptions"
              className="text-lg font-extrabold"
            >
              Giá trị
            </Label>
            <Select
              key={selectComponentKey}
              onValueChange={(value) => handleAddProductAttribute(value)}
            >
              <SelectTrigger
                id="attributeOptions"
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              >
                <SelectValue placeholder="Chọn giá trị" />
              </SelectTrigger>
              <SelectContent className="cursor-pointer">
                {props.selectedAttribute &&
                  attributeService
                    .getAvailableAttributeOptions(
                      props.selectedAttribute,
                      props.productAttributesAddition
                    )
                    .map((option, index) => {
                      return (
                        <SelectItem
                          key={index}
                          value={option.optionID}
                          className="max-w-[30rem] cursor-pointer truncate"
                        >
                          {option.optionValue}
                        </SelectItem>
                      );
                    })}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/** PRODUCT ATTRIBUTES */}
        <ScrollArea className="col-span-3">
          <div className="flex py-6 space-x-2">
            {props.productAttributesAddition.map((productAttribute, index) => (
              <Badge
                variant="outline"
                key={index}
                className="w-max text-base bg-secondary text-secondary-foreground"
              >
                <span>{`${productAttribute.typeValue} : ${productAttribute.optionValue}`}</span>
                <X
                  className="ml-2 hover_text-primary cursor-pointer"
                  onClick={() => props.onProductAttributeRemoval(index)}
                />
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {/** RIGHT */}
      <div className="space-y-2 mb-10">
        <Label htmlFor="desc" className="text-lg font-extrabold">
          Mô tả
        </Label>
        <Textarea
          id="desc"
          {...props.register("description")}
          placeholder="...abc"
          className="border-2 border-stone-400 text-lg min-h-12 focus_border-none h-full"
        />
      </div>
    </div>
  );
};

export default ProductAdditionSection;
