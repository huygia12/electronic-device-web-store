import { FC } from "react";
import { NavLink } from "react-router-dom";

const AvatarPlaceholder: FC = () => {
  return (
    <div className="space-x-2 text-[1.1rem] flex justify-end">
      <NavLink
        className="hover_text-primary-foreground hover_font-semibold"
        to="/login"
        unstable_viewTransition={true}
      >
        Đăng nhập
      </NavLink>
      <span>/</span>
      <NavLink
        className="hover_text-primary-foreground hover_font-semibold"
        to="/signup"
        unstable_viewTransition={true}
      >
        Đăng ký
      </NavLink>
    </div>
  );
};

export default AvatarPlaceholder;
