import axios from "axios";
import { axiosInstance } from "../axios";
import { User, UserUpdate } from "@/types/api";
import { SignupFormProps } from "@/utils/schema";
import { Args, Nullable } from "@/utils/declare";

const userApis = {
  signup: async (data: SignupFormProps) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/signup`,
      {
        userName: data.userName.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
      }
    );

    return response;
  },
  getUser: async (args: Args | string): Promise<Nullable<User>> => {
    let userID: string;
    if (typeof args === "string") {
      userID = args;
    } else {
      userID = args.params.id!;
    }

    try {
      const res = await axiosInstance.get<{ info: User }>(`/users/${userID}`);
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
      return null;
    }
  },
  updateUser: async (userID: string, data: UserUpdate): Promise<User> => {
    const res = await axiosInstance.put<{ info: User }>(
      `/users/${userID}`,
      data
    );
    return res.data.info;
  },
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await axiosInstance.get<{ info: User[] }>("/users");
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
};

export default userApis;
