import { ChangePasswordCard } from "@/components/user";
import ChangeProfileCard from "@/components/user/change-profile-card";
import { useCurrentUser } from "@/hooks";
import { User } from "@/types/model";
import { FC, useLayoutEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";

const EditProfile: FC = () => {
  const user = useRouteLoaderData("user_profile") as User;
  const { setCurrentUser } = useCurrentUser();

  useLayoutEffect(() => setCurrentUser(user), []);

  return (
    <div className="flex flex-col gap-10">
      <ChangeProfileCard />

      <ChangePasswordCard />
    </div>
  );
};

export default EditProfile;
