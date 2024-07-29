import React from "react";
import { NavLink } from "react-router-dom";

interface MobileNavBarTabProps {
  path: string;
  label: string;
  handleClick: () => void;
}

export const MobileNavBarTab: React.FC<MobileNavBarTabProps> = ({
  path,
  label,
  handleClick,
}) => {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        "mobile-nav-bar__tab " + (isActive ? "mobile-nav-bar__tab--active" : "")
      }
      onClick={handleClick}
    >
      {label}
    </NavLink>
  );
};
