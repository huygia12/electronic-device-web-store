import { Button } from "@/components/ui/button";
import { Attribute, AttributeOption, Category, Provider } from "@/types/model";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductAttributesFormProps,
  ProductInputFormProps,
  ProductItemsFormProps,
  ProductSchema,
} from "@/utils/schema";
import categoryService from "@/services/category";
import { attributeService, productService, providerService } from "@/services";
import { toast } from "sonner";
import { useCustomNavigate } from "@/hooks";
import {
  ProductAdditionSection,
  ProductItemAdditionSection,
} from "@/components/product-addition";

const ProductAddition: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const { navigate } = useCustomNavigate();
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
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
  const categoryID: string = watch("categoryID");
  const providerID: string = watch("providerID");

  useEffect(() => {
    const fetchData = async () => {
      const categories = await categoryService.apis.getCategories();
      const providers = await providerService.apis.getProviders();
      const attributes = await attributeService.apis.getAttributes();

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
    const option: AttributeOption | undefined =
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
    setSelectedAttribute(undefined);
  };

  const handleDeleteProductAttribute = (index: number) => {
    attributeController.remove(index);
  };

  const handleSelectAttributeType = (attribute: Attribute) => {
    setSelectedAttribute(
      attribute.typeID === selectedAttribute?.typeID ? undefined : attribute
    );
  };

  const handleSelectCategory = (id: string) => {
    setValue("categoryID", id);
    clearErrors("categoryID");
  };

  const handleSelectProvider = (id: string) => {
    setValue("providerID", id);
    clearErrors("providerID");
  };

  const handleFormSubmission: SubmitHandler<ProductInputFormProps> = async (
    data
  ) => {
    const toastID = toast.loading("Xử lý ảnh...");
    const productItemsToInsert =
      await productService.getProductItemsAfterUploadImages(data.productItems);

    const attributesToInsert = attributeService.getIDOutOfOptions(
      data.productAttributes
    );

    const addProduct = productService.apis.addProduct(
      data,
      attributesToInsert,
      productItemsToInsert
    );

    toast.dismiss(toastID);
    toast.promise(addProduct, {
      loading: "Thêm sản phẩm...",
      success: () => {
        navigate("/admin/products", {
          unstable_viewTransition: true,
        });
        return "Thêm thành công!";
      },
      error: () => {
        productService.handleConsequencesIfAddProductFail(productItemsToInsert);
        return "Thêm thất bại!";
      },
    });
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold mt-8 mb-10">Thêm sản phẩm</h1>
      <form onSubmit={handleSubmit(handleFormSubmission)}>
        {/** PRODUCT */}
        <ProductAdditionSection
          errors={errors}
          register={register}
          categories={categories}
          providers={providers}
          attributes={attributes}
          selectedCategory={categoryID}
          selectedProvider={providerID}
          selectedAttribute={selectedAttribute}
          productAttributesAddition={productAttributesAddition}
          handleSelectCategory={handleSelectCategory}
          handleSelectProvider={handleSelectProvider}
          handleDeleteProductAttribute={handleDeleteProductAttribute}
          handleSelectAttributeType={handleSelectAttributeType}
          handleAddProductAttribute={handleAddProductAttribute}
        />

        {/** ITEMS */}
        <ProductItemAdditionSection
          errors={errors}
          register={register}
          itemQuantity={itemQuantity}
          productAttributesAddition={productAttributesAddition}
          productItemsAddition={productItemsAddition}
        />

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
              Thêm sản phẩm
              <Plus />
            </Button>
          </span>
        </div>
      </form>
    </>
  );
};

export default ProductAddition;
