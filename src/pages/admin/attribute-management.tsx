import { FC, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import axios, { HttpStatusCode } from "axios";
import { AttributeOption, Attribute } from "@/types/model";
import { attributeService } from "@/services";
import {
  AttributeOptionTable,
  AttributeOptionTools,
  AttributeTypeTable,
  AttributeTypeTools,
} from "@/components/attribute-mananagement";
import { SearchBox } from "@/components/common";

const AttributeManagement: FC = () => {
  const initData = useRouteLoaderData("attribute_management") as Attribute[];
  const [attributes, setAttributes] = useState<Attribute[]>(initData);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>();
  const [selectedAttributeOption, setSelectedAttributeOption] =
    useState<AttributeOption>();
  const [searchText, setSearchText] = useState("");

  const handleAddAttributeType = async (value: string) => {
    const createAttributeType = attributeService.apis.addAttributeType(
      value.trim()
    );

    toast.promise(createAttributeType, {
      loading: "Đang xử lý...",
      success: (attribute: Attribute) => {
        setAttributes(attributeService.addAttributeType(attribute, attributes));
        setSelectedAttribute(undefined);
        setSelectedAttributeOption(undefined);
        return "Thêm thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Thêm thất bại: thể loại này đã tồn tại!";
          }
        }
        return "Thêm thất bại!";
      },
    });
  };

  const handleUpdateAttributeType = async (value: string) => {
    if (!selectedAttribute) return;

    const updateAttributeType = attributeService.apis.updateAttributeType(
      selectedAttribute.typeID,
      value.trim()
    );

    toast.promise(updateAttributeType, {
      loading: "Đang xử lý...",
      success: (attribute: Attribute) => {
        setAttributes([
          attribute,
          ...attributes.filter((attr) => attr.typeID !== attribute.typeID),
        ]);
        setSelectedAttribute(undefined);
        setSelectedAttributeOption(undefined);
        return "Thay đổi thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Thay đổi thất bại: thể loại này đã tồn tại!";
          }
        }
        return "Thay đổi thất bại!";
      },
    });
  };

  const handleDeleteAttributeType = async () => {
    if (!selectedAttribute) return;

    const deleteAttributeType = attributeService.apis.deleteAttributeType(
      selectedAttribute.typeID
    );

    toast.promise(deleteAttributeType, {
      loading: "Đang xử lý...",
      success: () => {
        setAttributes([
          ...attributes.filter(
            (attr) => attr.typeID !== selectedAttribute.typeID
          ),
        ]);
        setSelectedAttribute(undefined);
        setSelectedAttributeOption(undefined);
        return "Xóa thành công!";
      },
      error: "Xóa thất bại!",
    });
  };

  const handleAddAttributeOption = async (value: string) => {
    if (!selectedAttribute) return;

    const createAttributeOption = attributeService.apis.addAttributeOption(
      selectedAttribute.typeID,
      value.trim()
    );

    toast.promise(createAttributeOption, {
      loading: "Đang xử lý...",
      success: (attributeOption: AttributeOption) => {
        setAttributes(() =>
          attributeService.addAttributeOption(attributeOption, attributes)
        );
        setSelectedAttributeOption(undefined);
        return "Thêm thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Thêm thất bại: giá trị này đã tồn tại!";
          }
        }
        return "Thêm thất bại!";
      },
    });
  };

  const handleUpdateAttributeOption = async (value: string) => {
    if (!selectedAttribute || !selectedAttributeOption) return;

    const updateAttributeOption = attributeService.apis.updateAttributeOption(
      selectedAttributeOption.optionID,
      selectedAttribute.typeID,
      value.trim()
    );

    toast.promise(updateAttributeOption, {
      loading: "Đang xử lý...",
      success: (attributeOption: AttributeOption) => {
        setAttributes(
          attributeService.updateAttributeOption(attributeOption, attributes)
        );
        setSelectedAttributeOption(undefined);
        return "Thay đổi thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Thay đổi thất bại: giá trị này đã tồn tại!";
          }
        }
        return "Thay đổi thất bại!";
      },
    });
  };

  const handleDeleteAttributeOption = async () => {
    if (!selectedAttribute || !selectedAttributeOption) return;

    const deleteAttributeOption = attributeService.apis.deleteAttributeOption(
      selectedAttributeOption.typeID,
      selectedAttributeOption.optionID
    );

    toast.promise(deleteAttributeOption, {
      loading: "Đang xử lý...",
      success: () => {
        setAttributes(
          attributeService.deleteAttributeOption(
            selectedAttributeOption,
            attributes
          )
        );
        setSelectedAttributeOption(undefined);
        return "Xóa thành công!";
      },
      error: "Xóa thất bại!",
    });
  };

  const handleSearching = (value: string) => {
    setSearchText(value);
    setSelectedAttribute(undefined);
    setSelectedAttributeOption(undefined);
  };

  const handleSelectAttribute = (attribute: Attribute) => {
    setSelectedAttribute(attribute);
    setSelectedAttributeOption(undefined);
  };

  return (
    <div className="my-8 mx-auto w-[90vw] lgg_max-w-max">
      <SearchBox className="mb-4" setSearchText={handleSearching} />

      <div className="flex flex-col gap-4 mlg_grid mlg_grid-cols-2 lg_grid-cols-5">
        {/** ATTRIBUTE TYPE */}
        <div className="flex gap-4 lg_col-span-3">
          <AttributeTypeTools
            selectedAttribute={selectedAttribute}
            handleAddAttributeType={handleAddAttributeType}
            handleUpdateAttributeType={handleUpdateAttributeType}
            handleDeleteAttributeType={handleDeleteAttributeType}
          />

          <AttributeTypeTable
            className="flex-1"
            attributes={attributeService.getSearchingResult(
              searchText,
              attributes
            )}
            selectedAttribute={selectedAttribute}
            handleSelectAttribute={handleSelectAttribute}
          />
        </div>

        {/** ATTRIBUTE OPTION */}
        <div className="flex gap-4 lg_col-span-2">
          <AttributeOptionTable
            className="flex-1"
            attributes={attributes}
            selectedAttribute={selectedAttribute}
            selectedAttributeOption={selectedAttributeOption}
            setSelectedAttributeOption={setSelectedAttributeOption}
          />

          <AttributeOptionTools
            selectedAttribute={selectedAttribute}
            selectedAttributeOption={selectedAttributeOption}
            handleAddAttributeOption={handleAddAttributeOption}
            handleUpdateAttributeOption={handleUpdateAttributeOption}
            handleDeleteAttributeOption={handleDeleteAttributeOption}
          />
        </div>
      </div>
    </div>
  );
};

export default AttributeManagement;
