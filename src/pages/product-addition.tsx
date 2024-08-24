import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Attribute, AttributeOption, Category, Provider } from "@/types/api";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus, Trash2, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductAttributesFormProps,
  ProductInputFormProps,
  ProductItemsFormProps,
  ProductSchema,
} from "@/utils/schema";
import { LoadingSpinner } from "@/components/effect";
import categoryApis from "@/services/apis/category";
import { attributeApis, productApis, providerApis } from "@/services/apis";
import productService from "@/utils/product";
import attributeService from "@/utils/attribute";
import { Optional } from "@/utils/declare";
import { toast } from "sonner";
import { useCustomNavigate } from "@/hooks";

const ProductAddition: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const { navigate } = useCustomNavigate();

  const [selectComponentKey, setSelectComponentKey] = useState<number>(1);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductInputFormProps>({
    resolver: zodResolver(ProductSchema),
  });

  const itemController = useFieldArray({
    control,
    name: "productItems",
  });

  const attributeController = useFieldArray({
    control,
    name: "productAttributes",
  });

  const productItemsAddition: ProductItemsFormProps =
    watch("productItems") || [];
  const productAttributesAddition: ProductAttributesFormProps =
    watch("productAttributes") || [];
  console.log(productItemsAddition);
  useEffect(() => {
    const fetchData = async () => {
      const categories = await categoryApis.getCategories();
      const providers = await providerApis.getProviders();
      const attributes = await attributeApis.getAttributes();

      setCategories(categories);
      setProviders(providers);
      setAttributes(attributes);
    };

    fetchData();
  }, []);

  const handleAddItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    itemController.append({
      thump: null,
      quantity: null,
      price: null,
      productCode: "",
      discount: 0,
      color: "",
      storage: "",
      itemImages: null,
    });
    setItemQuantity(itemQuantity + 1);
  };

  const handleDeleteItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    itemController.remove(itemQuantity - 1);
    setItemQuantity(itemQuantity - 1);
  };

  const handleAddProductAttribute = (optionID: string) => {
    const option: Optional<AttributeOption> =
      selectedAttribute &&
      attributeService.findAttributeOption(selectedAttribute, optionID);

    if (option) {
      attributeController.append({
        typeID: selectedAttribute!.typeID,
        optionID: optionID,
        optionValue: option.optionValue,
        typeValue: selectedAttribute!.typeValue,
      });
    }
    setSelectComponentKey(selectComponentKey === 1 ? 2 : 1);
    setSelectedAttribute(undefined);
  };

  const handleDeleteProductAttribute = (index: number) => {
    attributeController.remove(index);
  };

  const handleSelectAttribute = (attribute: Attribute) => {
    setSelectedAttribute(
      attribute.typeID === selectedAttribute?.typeID ? undefined : attribute
    );
    setOpen(false);
  };

  const handleFormSubmission: SubmitHandler<ProductInputFormProps> = async (
    data
  ) => {
    const response: boolean = await productApis.addProduct(data);
    if (response) {
      toast.success("Thêm sản phẩm thành công!");
      navigate("/admin/products", {
        unstable_viewTransition: true,
      });
    } else {
      toast.error("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold mt-8 mb-10">Thêm sản phẩm</h1>
      <form onSubmit={handleSubmit(handleFormSubmission)}>
        {/** PRODUCT */}
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
                {...register("productName")}
                placeholder="abc"
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              />
              {errors.productName && (
                <div className="text-red-600">{errors.productName.message}</div>
              )}
            </div>
            {/** GURANTEE TIME SPAN */}
            <div className="space-y-2">
              <Label className="text-lg font-extrabold">
                Thời hạn bảo hành(tháng)
                <span className="text-red-600 ">*</span>
              </Label>
              <Input
                autoComplete={"off"}
                {...register("warranty")}
                type="number"
                min={0}
                className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
              />
              {errors.warranty && (
                <div className="text-red-600">{errors.warranty.message}</div>
              )}
            </div>
            {/** CATEGORY */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-lg font-extrabold">
                Danh mục
                <span className="text-red-600 ">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("categoryID", value)}>
                <SelectTrigger
                  {...register("categoryID")}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                >
                  <SelectValue id="category" className="p-0" />
                </SelectTrigger>
                {errors.categoryID && (
                  <div className="text-red-600">
                    {errors.categoryID.message}
                  </div>
                )}
                <SelectContent>
                  {categories.map((cate, index) => {
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
              <Select onValueChange={(value) => setValue("providerID", value)}>
                <SelectTrigger
                  value={watch("providerID")}
                  {...register("providerID")}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                >
                  <SelectValue id="provider" className="p-0" />
                </SelectTrigger>
                {errors.providerID && (
                  <div className="text-red-600">
                    {errors.providerID.message}
                  </div>
                )}
                <SelectContent className="">
                  {providers.map((provider, index) => {
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
                  {...register("length")}
                  min={0}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {errors.length && (
                  <div className="text-red-600">{errors.length.message}</div>
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
                  {...register("width")}
                  min={0}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {errors.width && (
                  <div className="text-red-600">{errors.width.message}</div>
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
                  {...register("height")}
                  min={0}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {errors.height && (
                  <div className="text-red-600">{errors.height.message}</div>
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
                  {...register("weight")}
                  min={0}
                  className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                />
                {errors.weight && (
                  <div className="text-red-600">{errors.weight.message}</div>
                )}
              </div>
            </div>
            <div className="col-span-3 grid grid-cols-2 gap-4">
              {/** ATTRIBUTES */}
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="atr" className="text-lg font-extrabold">
                  Thể loại
                </Label>
                <Popover open={open} onOpenChange={() => setOpen(!open)}>
                  <PopoverTrigger
                    asChild
                    className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                  >
                    <Button
                      variant="normal"
                      role="combobox"
                      // aria-expanded={open}
                      className="justify-between focus_!ring-2"
                    >
                      {selectedAttribute
                        ? selectedAttribute.typeValue
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
                              attributes,
                              productAttributesAddition
                            )
                            .map((attribute, index) => (
                              <CommandItem
                                key={index}
                                value={attribute.typeValue}
                                onSelect={() =>
                                  handleSelectAttribute(attribute)
                                }
                                className="text-lg cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedAttribute?.typeID ===
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
              {/** OPTIONS */}
              <div className="space-y-2">
                <Label htmlFor="option" className="text-lg font-extrabold">
                  Giá trị
                </Label>
                <Select
                  key={selectComponentKey}
                  onValueChange={(value) => handleAddProductAttribute(value)}
                >
                  <SelectTrigger className="border-2 border-stone-400 text-lg min-h-12 focus_border-none">
                    <SelectValue id="option" placeholder="Chọn giá trị" />
                  </SelectTrigger>
                  <SelectContent className="cursor-pointer">
                    {selectedAttribute &&
                      attributeService
                        .getAvailableAttributeOptions(
                          selectedAttribute,
                          productAttributesAddition
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
                {productAttributesAddition?.map((productAttribute, index) => (
                  <Badge
                    variant="outline"
                    key={index}
                    className="w-max text-base bg-secondary text-secondary-foreground"
                  >
                    <span>{`${productAttribute.typeValue} : ${productAttribute.optionValue}`}</span>
                    <X
                      className="ml-2 hover_text-primary cursor-pointer"
                      onClick={() => handleDeleteProductAttribute(index)}
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
              {...register("description")}
              placeholder="...abc"
              className="border-2 border-stone-400 text-lg min-h-12 focus_border-none h-full"
            />
          </div>
        </div>

        {/** ITEMS */}
        <ul className="mb-8">
          {Array.from({ length: itemQuantity }).map((_, parentIndex) => {
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
                    {...register(`productItems.${parentIndex}.thump` as const)}
                    type="file"
                    id={`thump-${parentIndex}`}
                    accept="image/*"
                  />
                  {productItemsAddition[parentIndex]?.thump &&
                    productItemsAddition[parentIndex].thump[0] && (
                      <img
                        src={productService.retrieveImageUrl(
                          productItemsAddition[parentIndex].thump[0]
                        )}
                        className="max-w-40 object-cover rounded-md border-stone-300 border-2"
                      />
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
                    {...register(
                      `productItems.${parentIndex}.itemImages` as const
                    )}
                    type="file"
                    id={`product-imgs-${parentIndex}`}
                    multiple
                    accept="image/*"
                  />
                  {/* {errors.productItems?.[parentIndex]?.thump?.[0] && (
                    <div className="text-red-600 pt-2">
                      {`${errors.productItems?.[parentIndex]?.thump?.message}`}
                    </div>
                  )} */}
                  {productItemsAddition[parentIndex]?.itemImages && (
                    <div className="overflow-auto flex flex-row gap-2 ">
                      {Array.from(
                        productItemsAddition[parentIndex].itemImages
                      ).map((element, index) => {
                        return (
                          <img
                            key={index}
                            src={productService.retrieveImageUrl(element)}
                            className="max-w-40 object-cover rounded-md border-stone-300 border-2"
                          />
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
                      {...register(
                        `productItems.${parentIndex}.price` as const
                      )}
                      id={`price-${parentIndex}`}
                      type="number"
                      autoComplete={"off"}
                      className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                    />
                    {errors.productItems?.[parentIndex]?.price && (
                      <div className="text-red-600 pt-2">
                        {`${errors.productItems?.[parentIndex]?.price?.message}`}
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
                      {...register(
                        `productItems.${parentIndex}.quantity` as const
                      )}
                      min={1}
                      max={1000000000}
                      id={`quantity-${parentIndex}`}
                      type="number"
                      autoComplete={"off"}
                      className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                    />
                    {errors.productItems?.[parentIndex]?.quantity && (
                      <div className="text-red-600 pt-2">
                        {`${errors.productItems?.[parentIndex]?.quantity?.message}`}
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
                      {...register(
                        `productItems.${parentIndex}.productCode` as const
                      )}
                      id={`code-${parentIndex}`}
                      type="text"
                      autoComplete={"off"}
                      className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                    />
                    {errors.productItems?.[parentIndex]?.productCode && (
                      <div className="text-red-600 pt-2">
                        {`${errors.productItems?.[parentIndex]?.quantity?.message}`}
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
                      {...register(
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
                    {errors.productItems?.[parentIndex]?.discount && (
                      <div className="text-red-600 pt-2">
                        {`${errors.productItems?.[parentIndex]?.quantity?.message}`}
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
                      {...register(
                        `productItems.${parentIndex}.color` as const
                      )}
                      id={`color-${parentIndex}`}
                      type="text"
                      autoComplete={"off"}
                      className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                    />
                    {errors.productItems?.[parentIndex]?.color && (
                      <div className="text-red-600 pt-2">
                        {`${errors.productItems?.[parentIndex]?.color?.message}`}
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
                      {...register(
                        `productItems.${parentIndex}.storage` as const
                      )}
                      id={`capacity-${parentIndex}`}
                      type="text"
                      autoComplete={"off"}
                      className="border-2 border-stone-400 text-lg min-h-12 focus_border-none"
                    />
                    {errors.productItems?.[parentIndex]?.storage && (
                      <div className="text-red-600 pt-2">
                        {`${errors.productItems?.[parentIndex]?.storage?.message}`}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/** BUTTONS */}
        <div className="flex justify-between">
          <span className="space-x-4 flex">
            <Button
              variant="positive"
              className="text-xl"
              onClick={(e) => handleAddItem(e)}
            >
              Thêm
              <Plus />
            </Button>
            <Button
              variant="negative"
              className={cn(
                "text-xl hidden",
                productItemsAddition.length > 1 && "flex"
              )}
              onClick={(e) => handleDeleteItem(e)}
            >
              Xóa
              <Trash2 />
            </Button>
          </span>
          <span className="space-x-4 flex items-center">
            {errors.root && (
              <div className="text-red-600">{errors.root?.message}</div>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="neutral"
              className="text-xl"
            >
              {!isSubmitting ? (
                <>
                  Thêm sản phẩm
                  <Plus />
                </>
              ) : (
                <LoadingSpinner size={26} className="text-white" />
              )}
            </Button>
          </span>
        </div>
      </form>
    </>
  );
};

export default ProductAddition;
