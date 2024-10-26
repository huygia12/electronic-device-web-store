import { Button } from "@/components/ui/button";
import {
  Attribute,
  AttributeOption,
  Category,
  Product,
  Provider,
} from "@/types/model";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { FC, useLayoutEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductAttributesFormProps,
  ProductItemsUpdateFormProps,
  ProductUpdateFormProps,
  ProductUpdateSchema,
} from "@/utils/schema";
import { LoadingSpinner } from "@/components/effect";
import categoryService from "@/services/category";
import { attributeService, productService, providerService } from "@/services";
import { useRouteLoaderData } from "react-router-dom";
import {
  ItemEdittionSection,
  ProductEdittionSection,
} from "@/components/product-edittion";
import { toast } from "sonner";
import { useCustomNavigate } from "@/hooks";

const ProductEdittion: FC = () => {
  const { navigate } = useCustomNavigate();
  const product = useRouteLoaderData("product_edition") as Product;
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const [selectComponentKey, setSelectComponentKey] = useState<number>(1);
  const [itemQuantity, setItemQuantity] = useState<number>(
    product.productItems.length
  );
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>();
  const [removedItem, setRemovedItem] = useState<ProductItemsUpdateFormProps>(
    []
  );

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductUpdateFormProps>({
    resolver: zodResolver(ProductUpdateSchema),
    defaultValues: productService.getProductUpdateDefaultValue(product),
  });

  const itemController = useFieldArray({
    control,
    name: "productItems",
  });

  const attributeController = useFieldArray({
    control,
    name: "productAttributes",
  });

  const productItemsAddition: ProductItemsUpdateFormProps =
    watch("productItems") || [];
  const productAttributesAddition: ProductAttributesFormProps =
    watch("productAttributes") || [];
  const categoryID: string = watch("categoryID");
  const providerID: string = watch("providerID");

  useLayoutEffect(() => {
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
    if (
      !(productItemsAddition[itemQuantity - 1].itemImages instanceof FileList)
    ) {
      setRemovedItem((prevValue) => [
        ...prevValue,
        productItemsAddition[itemQuantity - 1],
      ]);
    }
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
    setSelectComponentKey(selectComponentKey === 1 ? 2 : 1);
    setSelectedAttribute(undefined);
  };

  const handleDeleteProductAttribute = (index: number) => {
    attributeController.remove(index);
  };

  const handleSelectCategory = (id: string) => {
    setValue("categoryID", id);
    clearErrors("categoryID");
  };

  const handleSelectProvider = (id: string) => {
    setValue("providerID", id);
    clearErrors("providerID");
  };

  const handleSelectAttributeType = (attribute: Attribute) => {
    setSelectedAttribute(
      attribute.typeID === selectedAttribute?.typeID ? undefined : attribute
    );
  };

  const handleFormSubmission: SubmitHandler<ProductUpdateFormProps> = async (
    data
  ) => {
    const toastID = toast.loading("Xử lý ảnh...");
    const result = await productService.getProductItemsAfterUploadImages(
      data.productItems
    );

    const attributesToUpdate = attributeService.getIDOutOfOptions(
      data.productAttributes
    );

    const updateProduct = productService.apis.updateProduct(
      product.productID,
      data,
      attributesToUpdate,
      result.items,
      removedItem
    );
    console.log(result.uploadedImage);

    toast.dismiss(toastID);
    toast.promise(updateProduct, {
      loading: "Cập nhật sản phẩm...",
      success: () => {
        toast.dismiss(toastID);
        navigate("/admin/products", {
          unstable_viewTransition: true,
        });
        return "Cập nhật thành công!";
      },
      error: () => {
        toast.dismiss(toastID);
        productService.handleConsequencesIfCUProductFail(result.uploadedImage);
        return "Thêm thất bại!";
      },
    });
  };

  return (
    <div className="my-10">
      <h1 className="text-4xl font-extrabold mb-10">Sửa sản phẩm</h1>
      <form onSubmit={handleSubmit(handleFormSubmission)}>
        {/** PRODUCT */}
        <ProductEdittionSection
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
        <ItemEdittionSection
          product={product}
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
              {!isSubmitting ? (
                <>
                  Sửa sản phẩm
                  <Plus />
                </>
              ) : (
                <LoadingSpinner size={26} className="text-white" />
              )}
            </Button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default ProductEdittion;
