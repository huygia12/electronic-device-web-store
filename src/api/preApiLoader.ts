import {
  Account,
  AttributeType,
  Category,
  Invoice,
  Product,
  ProductParams,
  Provider,
} from "@/declare";
import { axiosInstance, reqConfig } from "@/utils/axiosConfig";
import axios from "axios";
import log from "loglevel";
import { ActionFunctionArgs, ParamParseKey, Params } from "react-router-dom";

interface Args extends ActionFunctionArgs {
  params: Params<ParamParseKey<string>> | ProductParams;
}

const getProducts = async (): Promise<Product[] | undefined> => {
  try {
    const res = await axios.get<Product[]>(
      import.meta.env.VITE_API_URL + "/products"
    );

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

const getCategories = async (): Promise<Category[] | undefined> => {
  try {
    const res = await axios.get<Category[]>(
      import.meta.env.VITE_API_URL + "/categories"
    );
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

const getProviders = async (): Promise<Provider[] | undefined> => {
  try {
    const res = await axiosInstance.get<{ info: Provider[] }>(
      import.meta.env.VITE_API_URL + "/providers",
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
    const res = await axios.get<AttributeType[]>(
      import.meta.env.VITE_API_URL + "/attributes"
    );
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

const getUsers = async (): Promise<Account[] | undefined> => {
  try {
    const res = await axios.get<Account[]>(
      import.meta.env.VITE_API_URL + "/accounts"
    );
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

const getOrders = async (): Promise<Invoice[] | undefined> => {
  try {
    const res = await axios.get<Invoice[]>(
      import.meta.env.VITE_API_URL + "/invoices"
    );
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
    const res = await axios.get<Product>(
      import.meta.env.VITE_API_URL + "/products/" + params.id
    );
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

export default {
  getProducts,
  getCategories,
  getProviders,
  getAttributes,
  getUsers,
  getOrders,
  getProductDetail,
};
