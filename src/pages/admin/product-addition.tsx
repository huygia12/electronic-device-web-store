import { Button } from "@/components/ui/button";
import { Attribute, AttributeOption, Category, Provider } from "@/types/model";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductAttributesFormProps,
  ProductInsertionFormProps,
  ProductItemsInsertionFormProps,
  ProductInsertionSchema,
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
  } = useForm<ProductInsertionFormProps>({
    resolver: zodResolver(ProductInsertionSchema),
  });

  const itemController = useFieldArray({
    control,
    name: "productItems",
  });

  const attributeController = useFieldArray({
    control,
    name: "productAttributes",
  });

  const productItemsAddition: ProductItemsInsertionFormProps =
    watch("productItems") || [];
  const productAttributesAddition: ProductAttributesFormProps =
    watch("productAttributes") || [];
  const categoryID: string = watch("categoryID");
  const providerID: string = watch("providerID");

  useEffect(() => {
    const fetchData = async () => {
      const categories = await categoryService.apis.getCategories();
      const providers = await providerService.apis.getProviders();
      const attributes = await attributeService.apis.getAttributes({});

      setCategories(categories);
      setProviders(providers);
      setAttributes(attributes);
    };

    fetchData();
  }, []);

  const handleAddItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    itemController.append(productService.createNewItemHolder());
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

  const handleFormSubmission: SubmitHandler<ProductInsertionFormProps> = async (
    data
  ) => {
    const toastID = toast.loading("Xử lý ảnh...");
    const result = await productService.getProductItemsAfterUploadImages(
      data.productItems
    );

    const attributesToInsert = attributeService.getIDOutOfOptions(
      data.productAttributes
    );

    const addProduct = productService.apis.addProduct(
      data,
      attributesToInsert,
      result.items
    );

    toast.dismiss(toastID);
    toast.promise(addProduct, {
      loading: "Thêm sản phẩm...",
      success: () => {
        toast.dismiss(toastID);
        navigate("/admin/products", {
          unstable_viewTransition: true,
        });
        return "Thêm thành công!";
      },
      error: () => {
        toast.dismiss(toastID);
        productService.handleConsequencesIfCUProductFail(result.uploadedImage);
        return "Thêm thất bại!";
      },
    });
  };

  return (
    <div className="my-8">
      <h1 className="text-4xl font-extrabold mb-10">Thêm sản phẩm</h1>
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
          onCategorySelection={handleSelectCategory}
          onProviderSelection={handleSelectProvider}
          onProductAttributeRemoval={handleDeleteProductAttribute}
          onAttributeTypeSelection={handleSelectAttributeType}
          onAttributeProductAdding={handleAddProductAttribute}
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
        <div className="mt-8 flex justify-between">
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
    </div>
  );
};

export default ProductAddition;
