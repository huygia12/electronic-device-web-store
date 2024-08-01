interface User {
  userName: string;
  email: string;
  userID?: string;
  avatar?: string;
  phoneNum?: string;
  createdAt?: Date;
  editedAt?: Date;
}

interface UserSummary {
  userName: string;
  userID: string;
  avatar: string | null;
  role: string;
}

export type { User, UserSummary };
