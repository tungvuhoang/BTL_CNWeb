import { Outlet } from "react-router-dom";
import Header from "./Header";
import "./BaseLayout.css";

const BaseLayout = ({ title, links = [], showLogout = true }) => {
  return (
    <div className="base-layout">
      <Header title={title} links={links} showLogout={showLogout} />
      <main className="base-layout__main" role="main">
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;