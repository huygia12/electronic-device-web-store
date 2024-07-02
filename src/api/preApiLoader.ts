import {
  User,
  AttributeType,
  Category,
  Invoice,
  Product,
  ProductParams,
  Provider,
  ProductSummary,
  ProductDetail,
} from "@/declare";
import { axiosInstance, reqConfig } from "@/utils/axiosConfig";
import axios from "axios";
import log from "loglevel";
import { ActionFunctionArgs, ParamParseKey, Params } from "react-router-dom";

interface Args extends ActionFunctionArgs {
  params: Params<ParamParseKey<string>> | ProductParams;
}

const getProducts = async (): Promise<ProductSummary[] | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: ProductSummary[] }>(
      "/products",
      reqConfig
    );

    return res.data.info;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError-specific handling
      log.error("Axios error:", error.message);
      if (error.response) {
        log.error("Response data:", error.response.data);
        log.error("Response status:", error.response.status);
      }
    } else {
      // General error handling
      log.error("Unexpected error:", error);
    }
  }
};

const getProductWithCategoryID = async (
  categoryID: string
): Promise<ProductDetail[] | undefined> => {
  try {
    const res = await axiosInstance.get<{
      info: ProductDetail[];
    }>(`/products?categoryID=${categoryID}`, reqConfig);

    return res.data.info;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError-specific handling
      log.error("Axios error:", error.message);
      if (error.response) {
        log.error("Response data:", error.response.data);
        log.error("Response status:", error.response.status);
      }
    } else {
      // General error handling
      log.error("Unexpected error:", error);
    }
  }
};
const getCategories = async (): Promise<Category[] | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: Category[] }>(
      "/categories",
      reqConfig
    );
    return res.data.info;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError-specific handling
      log.error("Axios error:", error.message);
      if (error.response) {
        log.error("Response data:", error.response.data);
        log.error("Response status:", error.response.status);
      }
    } else {
      // General error handling
      log.error("Unexpected error:", error);
    }
  }
};

const getProviders = async (): Promise<Provider[] | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: Provider[] }>(
      "/providers",
      reqConfig
    );
    return res.data.info;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError-specific handling
      log.error("Axios error:", error.message);
      if (error.response) {
        log.error("Response data:", error.response.data);
        log.error("Response status:", error.response.status);
      }
    } else {
      // General error handling
      log.error("Unexpected error:", error);
    }
  }
};

const getAttributes = async (): Promise<AttributeType[] | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: AttributeType[] }>(
      "/attributes",
      reqConfig
    );
    return res.data.info;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError-specific handling
      log.error("Axios error:", error.message);
      if (error.response) {
        log.error("Response data:", error.response.data);
        log.error("Response status:", error.response.status);
      }
    } else {
      // General error handling
      log.error("Unexpected error:", error);
    }
  }
};

const getUsers = async (): Promise<User[] | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: User[] }>("/users");
    return res.data.info;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError-specific handling
      log.error("Axios error:", error.message);
      if (error.response) {
        log.error("Response data:", error.response.data);
        log.error("Response status:", error.response.status);
      }
    } else {
      // General error handling
      log.error("Unexpected error:", error);
    }
  }
};

// const getOrders = async (): Promise<Invoice[] | undefined> => {
//   try {
//     const res = await axiosInstance.get<{ info: Invoice[] }>("/invoices");
//     return res.datat.info;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       // AxiosError-specific handling
//       log.error("Axios error:", error.message);
//       if (error.response) {
//         log.error("Response data:", error.response.data);
//         log.error("Response status:", error.response.status);
//       }
//     } else {
//       // General error handling
//       log.error("Unexpected error:", error);
//     }
//   }
// };

const getOrders = async (): Promise<Invoice[] | undefined> => {
  try {
    const res = await axiosInstance.get<Invoice[]>("/invoices");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError-specific handling
      log.error("Axios error:", error.message);
      if (error.response) {
        log.error("Response data:", error.response.data);
        log.error("Response status:", error.response.status);
      }
    } else {
      // General error handling
      log.error("Unexpected error:", error);
    }
  }
};

const getProductDetail = async ({
  params,
}: Args): Promise<Product | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: Product }>(
      "/products/" + params.id,
      reqConfig
    );
    // console.log(JSON.stringify(res.data.info));
    return res.data.info;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // AxiosError-specific handling
      log.error("Axios error:", error.message);
      if (error.response) {
        log.error("Response data:", error.response.data);
        log.error("Response status:", error.response.status);
      }
    } else {
      // General error handling
      log.error("Unexpected error:", error);
    }
  }
};

export default {
  getProducts,
  getCategories,
  getProviders,
  getAttributes,
  getUsers,
  getOrders,
  getProductDetail,
  getProductWithCategoryID,
};
