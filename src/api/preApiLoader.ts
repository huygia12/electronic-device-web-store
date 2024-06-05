import {
  BriefOrderAttributes,
  Category,
  Product,
  ProductAttribute,
  Provider,
  User,
} from "@/declare";
import axios from "axios";
import log from "loglevel";

log.setLevel("error");

const productsLoader = async (): Promise<Product[] | undefined> => {
  try {
    const res = await axios.get("http://localhost:4000/products");
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
    const res = await axios.get<Category[]>("http://localhost:4000/categories");
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
    const res = await axios.get("http://localhost:4000/providers");
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

const attributesLoader = async (): Promise<ProductAttribute[] | undefined> => {
  try {
    const res = await axios.get("http://localhost:4000/attributes");
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

const usersLoader = async (): Promise<User[] | undefined> => {
  try {
    const res = await axios.get("http://localhost:4000/users");
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

const ordersLoader = async (): Promise<BriefOrderAttributes[] | undefined> => {
  try {
    const res = await axios.get("http://localhost:4000/orders");
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
};
