import {
  ChangePasswordCard,
  ChangeProfileCard,
} from "@/components/edit-user-profile";
import { useCurrentUser } from "@/hooks";
import { User } from "@/types/model";
import { FC, useLayoutEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";

const EditProfile: FC = () => {
  const user = useRouteLoaderData("user_profile") as User;
  const { setCurrentUser } = useCurrentUser();

  useLayoutEffect(() => setCurrentUser(user), []);

  return (
    <div className="flex flex-col items-center gap-10">
      <ChangeProfileCard />

      <ChangePasswordCard />
    </div>
  );
};

export default EditProfile;
