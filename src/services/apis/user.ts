import axios from "axios";
import { axiosInstance } from "../axios";
import { User } from "@/types/api";
import { SignupFormProps } from "@/schema";

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
  getUsers: async (): Promise<User[] | undefined> => {
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
    }
  },
};

export default userApis;
