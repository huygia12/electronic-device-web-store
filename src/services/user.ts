import { AxiosResponse } from "axios";
import {
  axiosInstance,
  axiosInstanceWithoutAuthorize,
} from "@/config/axios-config";
import { UserUpdate } from "@/types/api";
import { User } from "@/types/model";
import { SignupFormProps } from "@/utils/schema";
import { Args, Nullable, Optional } from "@/utils/declare";
import { Role } from "@/types/enum";
import firebaseService from "./firebase";

const userEndPoint = "/users";

const userService = {
  apis: {
    signup: async (data: SignupFormProps, avatarFile?: File): Promise<User> => {
      const response = await axiosInstanceWithoutAuthorize.post<{ info: User }>(
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
    getUser: async (args: Args | string): Promise<Nullable<User>> => {
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
      data: UserUpdate,
      currentUser: User,
      avatarFile?: File
    ): Promise<User> => {
      let avatarUrl: Optional<string>;
      if (avatarFile) {
        currentUser.avatar &&
          (await firebaseService.apis.deleteImageInFireBase(
            currentUser.avatar
          ));
        avatarUrl = await firebaseService.apis.insertImageToFireBase(
          avatarFile,
          `/users/${currentUser.userID}`
        );
      }

      const res = await axiosInstance.put<{ info: User }>(
        `${userEndPoint}/${userID}`,
        {
          ...data,
          avatar: avatarUrl,
        }
      );
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
      let queryUrl: string = `${userEndPoint}?`;

      params.recently === true && (queryUrl += `recently=${params.recently}&`);
      params.searching && (queryUrl += `searching=${params.searching}&`);
      params.currentPage && (queryUrl += `currentPage=${params.currentPage}`);

      const res = await axiosInstance.get<{
        info: { users: User[]; totalUsers: number };
      }>(queryUrl);
      return res.data.info;
    },
    deleteUser: async (userID: string): Promise<AxiosResponse> => {
      const res = await axiosInstance.delete(`${userEndPoint}/${userID}`);
      return res;
    },
  },
  getRoleToDisplay: (role: Role) => {
    return role === Role.ADMIN ? "Admin" : "Khách hàng";
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
