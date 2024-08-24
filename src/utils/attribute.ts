import { ProductAttributesFormProps } from "@/schema";
import { Attribute, AttributeOption } from "@/types/api";
import { Optional } from "./declare";

const attributeService = {
  getAvailableAttributes: (
    attributes: Attribute[],
    addedAttributes: ProductAttributesFormProps
  ): Attribute[] => {
    return attributes.filter(
      (attribute) =>
        !addedAttributes.find(
          (addedAttribute) => addedAttribute.typeID === attribute.typeID
        )
    );
  },
  getAvailableAttributeOptions: (
    attribute: Attribute,
    addedAttributes: ProductAttributesFormProps
  ): AttributeOption[] => {
    return (
      attribute?.attributeOptions.reduce<AttributeOption[]>((prev, curr) => {
        if (
          !addedAttributes.find(
            (attribute) => attribute.optionID === curr.optionID
          )
        ) {
          prev.push({
            typeID: curr.typeID,
            optionID: curr.optionID,
            optionValue: curr.optionValue,
          });
        }
        return prev;
      }, []) || []
    );
  },
  findAttributeOption: (
    attribute: Attribute,
    optionID: string
  ): Optional<AttributeOption> => {
    return attribute.attributeOptions.find(
      (option) => option.optionID === optionID
    );
  },
  findFirstAttributeOption: (attribute: Attribute) => {
    return attribute.attributeOptions[0];
  },
};

export default attributeService;
