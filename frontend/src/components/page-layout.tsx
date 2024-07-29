import React from "react";
import { NavBar } from "./navigation/desktop/nav-bar";
// import { MobileNavBar } from "./navigation/mobile/mobile-nav-bar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="page-layout">
      <NavBar />
      {/* <MobileNavBar /> */}
      <div>{children}</div>
    </div>
  );
};
