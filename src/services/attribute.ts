import axios, { AxiosResponse } from "axios";
import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
  reqConfig,
} from "@/config";
import { Attribute, AttributeOption } from "@/types/model";
import { ProductAttributesFormProps } from "@/utils/schema";
import { Optional } from "@/utils/declare";

const attributeService = {
  apis: {
    getAttributes: async (): Promise<Attribute[]> => {
      try {
        const res = await axiosInstanceWithoutAuthorize.get<{
          info: Attribute[];
        }>("/attributes", reqConfig);
        return res.data.info;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // AxiosError-specific handling
          console.error("Axios error:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        } else {
          // General error handling
          console.error("Unexpected error:", error);
        }
        return [];
      }
    },
    addAttributeType: async (name: string): Promise<AxiosResponse> => {
      const response = await axiosInstance.post(
        "/attributes",
        {
          typeValue: name,
        },
        reqConfig
      );
      return response;
    },
    updateAttributeType: async (
      typeID: string,
      newName: string
    ): Promise<AxiosResponse> => {
      const response = await axiosInstance.put(
        `/attributes/${typeID}`,
        {
          typeValue: newName,
        },
        reqConfig
      );
      return response;
    },
    deleteAttribute: async (typeID: string): Promise<AxiosResponse> => {
      const response = await axiosInstance.delete(
        `/attributes/${typeID}`,
        reqConfig
      );
      return response;
    },
    addAttributeOption: async (
      typeID: string,
      option: string
    ): Promise<AxiosResponse> => {
      const response = await axiosInstance.post(
        `/attributes/${typeID}/options`,
        {
          optionValue: option,
        },
        reqConfig
      );
      return response;
    },
    updateAttributeOption: async (
      optionID: string,
      newName: string,
      typeID: string
    ): Promise<AxiosResponse> => {
      const response = await axiosInstance.put(
        `/attributes/${typeID}/options/${optionID}`,
        {
          optionValue: newName,
        },
        reqConfig
      );
      return response;
    },
    deleteAttributeOption: async (typeID: string, optionID: string) => {
      const response = await axiosInstance.delete(
        `/attributes/${typeID}/options/${optionID}`,
        reqConfig
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
