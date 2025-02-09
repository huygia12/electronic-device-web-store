import { AxiosResponse } from "axios";
import { axiosInstance } from "@/config/axios-config";
import { UserUpdatePayload } from "@/types/payload";
import { User } from "@/types/model";
import { SignupFormProps } from "@/utils/schema";
import { Args } from "@/utils/helpers";
import { Role } from "@/types/enum";
import firebaseService from "./firebase";

const userEndPoint = "/users";

const userService = {
  apis: {
    signup: async (data: SignupFormProps, avatarFile?: File): Promise<User> => {
      const response = await axiosInstance.post<{ info: User }>(
        `${userEndPoint}/signup`,
        {
          userName: data.userName.trim(),
          email: data.email.trim(),
          password: data.password.trim(),
          avatar: data.avatar,
          phoneNumber: data.phoneNumber,
        }
      );

      if (avatarFile) {
        const avatarUrl = (
          await firebaseService.apis.insertImagesToFireBase(
            data.avatar,
            `/users/${response.data.info.userID}`
          )
        )[0];

        const newUser: User = await userService.apis.updateUserAvatar(
          response.data.info.userID,
          avatarUrl
        );

        return newUser;
      }

      return response.data.info;
    },
    getUser: async (args: Args | string): Promise<User | null> => {
      let userID: string;
      if (typeof args === "string") {
        userID = args;
      } else {
        userID = args.params.id!;
      }

      try {
        const res = await axiosInstance.get<{ info: User }>(
          `${userEndPoint}/${userID}`
        );
        return res.data.info;
      } catch (error) {
        console.error("Unexpected error:", error);
        return null;
      }
    },
    updateUser: async (
      userID: string,
      data: UserUpdatePayload,
      currentUser: User,
      avatarFile?: File
    ): Promise<User> => {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await firebaseService.apis.insertImageToFireBase(
          avatarFile,
          `/users/${currentUser.userID}`
        );
      }

      const res = await axiosInstance.put<{ info: User }>(
        `${userEndPoint}/${userID}`,
        {
          ...data,
          phoneNumber:
            data.phoneNumber?.trim()?.length == 0
              ? undefined
              : data.phoneNumber,
          avatar: avatarUrl,
        }
      );

      if (avatarUrl && currentUser.avatar) {
        firebaseService.apis.deleteImageInFireBase(currentUser.avatar);
      }

      return res.data.info;
    },
    updatePassword: async (
      userID: string,
      prePassword: string,
      newPassword: string
    ): Promise<AxiosResponse> => {
      const res = await axiosInstance.patch(`${userEndPoint}/${userID}`, {
        oldPassword: prePassword,
        newPassword: newPassword,
      });
      return res;
    },
    updateUserAvatar: async (userID: string, avatar: string): Promise<User> => {
      const res = await axiosInstance.put<{ info: User }>(
        `${userEndPoint}/${userID}`,
        {
          avatar: avatar,
        }
      );

      return res.data.info;
    },
    getUsers: async (params: {
      recently?: boolean;
      searching?: string;
      currentPage?: number;
    }): Promise<{ users: User[]; totalUsers: number }> => {
      let path: string = `${userEndPoint}?`;

      params.recently === true && (path += `recently=${params.recently}&`);
      params.searching && (path += `searching=${params.searching}&`);
      params.currentPage && (path += `currentPage=${params.currentPage}`);

      const res = await axiosInstance.get<{
        info: { users: User[]; totalUsers: number };
      }>(path);
      return res.data.info;
    },
    deleteUser: async (userID: string): Promise<AxiosResponse> => {
      const res = await axiosInstance.delete(`${userEndPoint}/${userID}`);
      return res;
    },
    generateOTP: async (email: string): Promise<AxiosResponse> => {
      const res = await axiosInstance.post(`${userEndPoint}/forgot-password`, {
        email: email,
      });
      return res;
    },
    verifyOTP: async (email: string, otp: string): Promise<boolean> => {
      const res = await axiosInstance.post<{ info: { result: boolean } }>(
        `${userEndPoint}/verify-otp`,
        {
          email: email,
          otp: otp,
        }
      );

      return res.data.info.result;
    },
  },
  getRoleToDisplay: (role: Role) => {
    return role === Role.ADMIN ? "Admin" : "Khách hàng";
  },
  getRoleToDisplayInShort: (role: Role) => {
    return role === Role.ADMIN ? "AD" : "KH";
  },
  addUser: (user: User, users: User[]) => {
    return [user, ...users];
  },
  updateUser: (user: User, users: User[]) => {
    return [user, ...users.filter((e) => e.userID !== user.userID)];
  },
  deleteUser: (user: User, users: User[]) => {
    return [...users.filter((e) => e.userID !== user.userID)];
  },
};

export default userService;
