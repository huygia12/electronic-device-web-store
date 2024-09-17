import { Nullable } from "@/utils/declare";
import {
  District,
  Province,
  ServiceRes,
  ShippingAmountRes,
  ShippingTimeRes,
  Ward,
} from "@/types/api";
import { CartItem } from "@/types/model";
import axios from "axios";
import { applyDiscount } from "@/utils/helpers";

const deliveryService = {
  apis: {
    getProvinces: async (): Promise<Province[]> => {
      try {
        const response = await axios.get<{ data: Province[] }>(
          import.meta.env.VITE_GHN_PROVINCE,
          {
            headers: {
              token: import.meta.env.VITE_GHN_TOKEN,
            },
          }
        );

        return response.data.data;
      } catch (error: unknown) {
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
    getDistricts: async (provinceID: number): Promise<District[]> => {
      try {
        const response = await axios.post<{ data: District[] }>(
          import.meta.env.VITE_GHN_DISTRICT,
          { province_id: provinceID },
          {
            headers: {
              token: import.meta.env.VITE_GHN_TOKEN,
            },
          }
        );

        return response.data.data;
      } catch (error: unknown) {
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
    getWards: async (districtID: number): Promise<Ward[]> => {
      try {
        const response = await axios.post<{ data: Ward[] }>(
          import.meta.env.VITE_GHN_WARD,
          { district_id: Number(districtID) },
          {
            headers: {
              token: import.meta.env.VITE_GHN_TOKEN,
            },
          }
        );

        return response.data.data;
      } catch (error: unknown) {
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
    getServices: async (districtID: number): Promise<Nullable<ServiceRes>> => {
      try {
        const response = await axios.post<ServiceRes>(
          import.meta.env.VITE_GHN_SERVICE,
          {
            shop_id: Number(import.meta.env.VITE_SHOP_ID),
            from_district: Number(import.meta.env.VITE_SHOP_DISTRICT_ID),
            to_district: districtID,
          },
          {
            headers: {
              token: import.meta.env.VITE_GHN_TOKEN,
            },
          }
        );

        return response.data;
      } catch (error: unknown) {
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
        return null;
      }
    },
    getShippingFee: async (
      serviceID: number,
      districtID: number,
      wardID: string,
      item: CartItem
    ): Promise<Nullable<number>> => {
      try {
        const response = await axios.post<ShippingAmountRes>(
          import.meta.env.VITE_GHN_SHIPPINGFEE,
          {
            from_district_id: Number(import.meta.env.VITE_SHOP_DISTRICT_ID),
            from_ward_code: import.meta.env.VITE_SHOP_WARD_CODE,
            service_id: serviceID,
            to_district_id: districtID,
            to_ward_code: wardID,
            height: Math.ceil(item.height),
            length: Math.ceil(item.length),
            weight: Math.ceil(item.weight),
            width: Math.ceil(item.width),
            insurance_value: applyDiscount(item.price, item.discount),
          },
          {
            headers: {
              token: import.meta.env.VITE_GHN_TOKEN,
              shop_id: Number(import.meta.env.VITE_SHOP_ID),
            },
          }
        );
        return response.data.data.total;
      } catch (error: unknown) {
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
        return null;
      }
    },
    getDeliveryTime: async (
      serviceID: number,
      districtID: number,
      wardID: string
    ): Promise<Nullable<number>> => {
      try {
        const response = await axios.post<ShippingTimeRes>(
          import.meta.env.VITE_GHN_SHIPPINGTIME,
          {
            from_district_id: Number(import.meta.env.VITE_SHOP_DISTRICT_ID),
            from_ward_code: import.meta.env.VITE_SHOP_WARD_CODE,
            to_district_id: districtID,
            to_ward_code: wardID,
            service_id: serviceID,
          },
          {
            headers: {
              shop_id: Number(import.meta.env.VITE_SHOP_ID),
              token: import.meta.env.VITE_GHN_TOKEN,
            },
          }
        );

        return response.data.data.leadtime;
      } catch (error: unknown) {
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
        return null;
      }
    },
  },
};

export default deliveryService;