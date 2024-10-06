import axios, { AxiosResponse } from "axios";
import { axiosInstance } from "@/config/axios-config";
import { UserUpdate } from "@/types/api";
import { User } from "@/types/model";
import { SignupFormProps } from "@/utils/schema";
import { Args, Nullable } from "@/utils/declare";
import { Role } from "@/types/enum";

const userService = {
  apis: {
    signup: async (data: SignupFormProps): Promise<string> => {
      const response = await axios.post<{ info: { userID: string } }>(
        `${import.meta.env.VITE_API_URL}/users/signup`,
        {
          userName: data.userName.trim(),
          email: data.email.trim(),
          password: data.password.trim(),
          avatar: data.avatar,
          phoneNumber: data.phoneNumber,
        }
      );

      return response.data.info.userID;
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
    updateUserAvatar: async (userID: string, avatar: string): Promise<User> => {
      const res = await axiosInstance.put<{ info: User }>(`/users/${userID}`, {
        avatar: avatar,
      });
      return res.data.info;
    },
    getUsers: async (params: { recently?: boolean }): Promise<User[]> => {
      let queryUrl: string = "/users";
      if (params.recently === true) {
        queryUrl = `/users?recently=${params.recently}`;
      }

      try {
        const res = await axiosInstance.get<{ info: User[] }>(queryUrl);
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
    deleteUser: async (userID: string): Promise<AxiosResponse> => {
      const res = await axiosInstance.delete(`/users/${userID}`);
      return res;
    },
  },
  getRoleToDisplay: (role: Role) => {
    return role === Role.ADMIN ? "Admin" : "Khách hàng";
  },
};

export default userService;
