import {
  Account,
  AttributeType,
  Category,
  Invoice,
  Product,
  ProductParams,
  Provider,
} from "@/declare";
import axios from "axios";
import log from "loglevel";
import { ActionFunctionArgs, ParamParseKey, Params } from "react-router-dom";

log.setLevel("error");

const productsLoader = async (): Promise<Product[] | undefined> => {
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

const categoriesLoader = async (): Promise<Category[] | undefined> => {
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

const providersLoader = async (): Promise<Provider[] | undefined> => {
  try {
    const res = await axios.get<Provider[]>(
      import.meta.env.VITE_API_URL + "/providers"
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

const attributesLoader = async (): Promise<AttributeType[] | undefined> => {
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

const usersLoader = async (): Promise<Account[] | undefined> => {
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

const ordersLoader = async (): Promise<Invoice[] | undefined> => {
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

interface Args extends ActionFunctionArgs {
  params: Params<ParamParseKey<string>> | ProductParams;
}

const productDetailLoader = async ({
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

export {
  productsLoader,
  categoriesLoader,
  providersLoader,
  attributesLoader,
  usersLoader,
  ordersLoader,
  productDetailLoader,
};
