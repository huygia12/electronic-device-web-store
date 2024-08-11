import { Role } from "@/utils/constants";
import { Nullable } from "@/utils/declare";

interface User {
  userID: string;
  userName: string;
  email: string;
  phoneNumber: Nullable<string>;
  avatar: Nullable<string>;
  isBanned: Nullable<boolean>;
  role: Role;
  createdAt: Date;
  updateAt: Date;
}

// interface UserSummary {
//   userName: string;
//   userID: string;
//   avatar: string | null;
//   role: string;
// }

interface AuthUser {
  userID: string;
  userName: string;
  email: string;
  avatar: Nullable<string>;
  role: Role;
  exp: string;
}

export type { User, AuthUser };
