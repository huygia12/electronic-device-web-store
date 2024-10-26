import { User } from "@/types/model";
import { FC, useEffect, useRef, useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { userService } from "@/services";
import { UserTable, UserTools } from "@/components/user-management";
import { CustomPagination, SearchBox } from "@/components/common";
import { SignupFormProps, UserFormProps } from "@/utils/schema";
import axios, { HttpStatusCode } from "axios";
import { getPages } from "@/utils/helpers";
import { useSocket } from "@/hooks";
import { SocketEmitError } from "@/types/socket";

const UserManagement: FC = () => {
  const searchingDelay = useRef<number>(2000);
  const initData = useRouteLoaderData("user_management") as {
    users: User[];
    totalUsers: number;
  };
  const [users, setUsers] = useState<User[]>(initData.users);
  const [totalPages, setTotalPages] = useState<number>(
    getPages(initData.totalUsers)
  );
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>();
  const toasting = useRef<{
    id: string | number;
    state: boolean;
  } | null>();
  const { socket } = useSocket();

  useEffect(() => {
    if (toasting.current === undefined) {
      toasting.current = null;
    } else {
      if (!toasting.current?.state) {
        toasting.current = { id: toast.loading("Đang xử lý..."), state: true };
      }
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res: { users: User[]; totalUsers: number } =
          await userService.apis.getUsers({
            searching: searchText,
            currentPage: currentPage,
          });

        setUsers(res.users);
        setTotalPages(getPages(res.totalUsers));
      } finally {
        toast.dismiss(toasting.current!.id);
        toasting.current = null;
      }
    }, searchingDelay.current);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText, currentPage]);

  const handleDeleteUser = () => {
    const deleteUser = userService.apis.deleteUser(selectedUser!.userID);
    toast.promise(deleteUser, {
      loading: "Đang xử lý...",
      success: () => {
        setUsers(userService.deleteUser(selectedUser!, users));
        setSelectedUser(undefined);
        return "Xóa thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Xóa thất bại: người dùng này không thể bị xóa!";
          }
        }
        return "Xóa thất bại";
      },
    });
  };

  const handleUpdateUser = (data: UserFormProps, avatarFile?: File) => {
    const updateUser = userService.apis.updateUser(
      selectedUser!.userID,
      {
        userName: data.userName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
      selectedUser!,
      avatarFile
    );

    toast.promise(updateUser, {
      loading: "Đang xử lý...",
      success: (user: User) => {
        setSelectedUser(user);
        setUsers(userService.updateUser(user, users));
        return "Cập nhật thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Cập nhật thất bại: email này đã được sử dụng!";
          }
        }
        return "Cập nhật thất bại";
      },
    });
  };

  const handleAddUser = (data: SignupFormProps, avatarFile?: File) => {
    const signup = userService.apis.signup(
      {
        userName: data.userName,
        email: data.email,
        password: data.password,
        retypePassword: data.retypePassword,
        phoneNumber: data.phoneNumber,
      },
      avatarFile
    );

    toast.promise(signup, {
      loading: "Đang xử lý...",
      success: (user: User) => {
        setUsers(userService.addUser(user, users));
        return "Thêm thành công!";
      },
      error: (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status == HttpStatusCode.Conflict) {
            return "Thêm thất bại: email này đã được sử dụng!";
          }
        }
        return "Thêm thất bại!";
      },
    });
  };

  const handleBanUser = (value: boolean) => {
    socket?.emit(
      `user:ban`,
      {
        userID: selectedUser!.userID,
        banned: value,
      },
      (error: SocketEmitError | undefined) => {
        let response: string;
        if (error) {
          response = "Mở khóa người dùng thất bại!";
          if (value) response = "Khóa người dùng thất bại!";
          toast.error(response);
        } else {
          response = "Mở khóa người dùng thành công!";
          if (value) response = "Khóa người dùng thành công!";
          toast.success(response);
        }
      }
    );
  };

  return (
    <div className="my-8">
      <SearchBox className="mb-4" setSearchText={setSearchText} />

      <div className="flex gap-4">
        <UserTable
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          handleBanUser={handleBanUser}
          className="flex-1 w-1" // set width to make flex work ????
        />

        <UserTools
          selectedUser={selectedUser}
          handleAddUser={handleAddUser}
          handleUpdateUser={handleUpdateUser}
          handleDeleteUser={handleDeleteUser}
        />
      </div>

      <CustomPagination
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default UserManagement;
