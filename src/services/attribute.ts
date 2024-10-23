import { AxiosResponse } from "axios";
import { axiosInstance } from "@/config";
import { Attribute, AttributeOption } from "@/types/model";
import { ProductAttributesFormProps } from "@/utils/schema";

const attributeEndPoint = "/attributes";

const attributeService = {
  apis: {
    getAttributes: async (params: {
      providerID?: string;
      categoryID?: string;
    }): Promise<Attribute[]> => {
      let path = `${attributeEndPoint}?`;
      params.providerID && (path += `providerID=${params.providerID}&`);
      params.categoryID && (path += `categoryID=${params.categoryID}`);

      const res = await axiosInstance.get<{
        info: Attribute[];
      }>(path);

      return res.data.info;
    },
    addAttributeType: async (name: string): Promise<Attribute> => {
      const response = await axiosInstance.post<{ info: Attribute }>(
        attributeEndPoint,
        {
          typeValue: name,
        }
      );
      return response.data.info;
    },
    updateAttributeType: async (
      typeID: string,
      newName: string
    ): Promise<Attribute> => {
      const response = await axiosInstance.put<{ info: Attribute }>(
        `${attributeEndPoint}/${typeID}`,
        {
          typeValue: newName,
        }
      );

      return response.data.info;
    },
    deleteAttributeType: async (typeID: string): Promise<AxiosResponse> => {
      const response = await axiosInstance.delete(
        `${attributeEndPoint}/${typeID}`
      );

      return response;
    },
    addAttributeOption: async (
      typeID: string,
      option: string
    ): Promise<AttributeOption> => {
      const response = await axiosInstance.post<{ info: AttributeOption }>(
        `${attributeEndPoint}/${typeID}/options`,
        {
          optionValue: option,
        }
      );

      return response.data.info;
    },
    updateAttributeOption: async (
      optionID: string,
      typeID: string,
      newName: string
    ): Promise<AttributeOption> => {
      const response = await axiosInstance.put<{ info: AttributeOption }>(
        `${attributeEndPoint}/${typeID}/options/${optionID}`,
        {
          optionValue: newName,
        }
      );
      return response.data.info;
    },
    deleteAttributeOption: async (typeID: string, optionID: string) => {
      const response = await axiosInstance.delete(
        `${attributeEndPoint}/${typeID}/options/${optionID}`
      );
      return response;
    },
  },
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
  ): AttributeOption | undefined => {
    return attribute.attributeOptions.find(
      (option) => option.optionID === optionID
    );
  },
  findFirstAttributeOption: (attribute: Attribute) => {
    return attribute.attributeOptions[0];
  },
  addAttributeType: (
    attributeType: Attribute,
    attributes: Attribute[]
  ): Attribute[] => {
    return [attributeType, ...attributes];
  },
  addAttributeOption: (
    option: AttributeOption,
    attributes: Attribute[]
  ): Attribute[] => {
    const attribute = attributes.find(
      (attribute) => attribute.typeID === option.typeID
    );

    return attributes.map((attr) => {
      if (attribute!.typeID === option.typeID) {
        return {
          ...attr,
          attributeOptions: [option, ...attr.attributeOptions],
        };
      } else {
        return attr;
      }
    });
  },
  updateAttributeOption: (
    option: AttributeOption,
    attributes: Attribute[]
  ): Attribute[] => {
    const attribute = attributes.find(
      (attribute) => attribute.typeID === option.typeID
    );

    return attributes.map((attr) => {
      if (attribute!.typeID === option.typeID) {
        return {
          ...attr,
          attributeOptions: [
            option,
            ...attr.attributeOptions.filter(
              (e) => e.optionID !== option.optionID
            ),
          ],
        };
      } else {
        return attr;
      }
    });
  },
  deleteAttributeOption: (
    option: AttributeOption,
    attributes: Attribute[]
  ): Attribute[] => {
    const attribute = attributes.find(
      (attribute) => attribute.typeID === option.typeID
    );

    return attributes.map((attr) => {
      if (attribute!.typeID === option.typeID) {
        return {
          ...attr,
          attributeOptions: [
            ...attr.attributeOptions.filter(
              (e) => e.optionID !== option.optionID
            ),
          ],
        };
      } else {
        return attr;
      }
    });
  },
  getSearchingResult: (text: string, attributes: Attribute[]): Attribute[] => {
    return attributes.filter((attr) =>
      attr.typeValue.toLowerCase().includes(text.toLowerCase())
    );
  },
  getIDOutOfOptions: (
    attributes: ProductAttributesFormProps | undefined
  ): string[] | undefined => {
    let options: string[] | undefined = attributes?.reduce<string[]>(
      (prev, curr) => {
        prev.push(curr.optionID);
        return prev;
      },
      []
    );
    options && options.length <= 0 && (options = undefined);

    return options;
  },
  filterEmtyAttributeOptions: (attributes: Attribute[]): Attribute[] => {
    return attributes.filter(
      (attribute) => attribute.attributeOptions.length > 0
    );
  },
};

export default attributeService;
