import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { getHostBreadcrumbs } from "../utils/hostBreadcrumbs";
import "./BaseLayout.css";

/**
 * App shell: optional sidebar, breadcrumbs from route `handle.crumb`,
 * themed main + footer. Mobile drawer for sidebar.
 * Breadcrumb dùng pathname (getHostBreadcrumbs) — không dùng useMatches với BrowserRouter.
 */
const BaseLayout = ({
  sidebarItems = [],
  showLogout = true,
}) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const crumbs = getHostBreadcrumbs(location.pathname);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  const hasSidebar = sidebarItems.length > 0;

  return (
    <div className="base-layout">
      {hasSidebar && sidebarOpen && (
        <div
          className="base-sidebar-overlay"
          aria-label="Đóng menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {hasSidebar && (
        <aside
          id="host-sidebar"
          className={`base-sidebar ${sidebarOpen ? "base-sidebar--open" : ""}`}
        >
          <div className="base-sidebar__header">
            <span className="base-sidebar__logo-icon" aria-hidden>
              🎮
            </span>
            <div className="base-sidebar__logo-text">
              <p className="base-sidebar__app-name">Web_Quiz</p>
              <p className="base-sidebar__role">Host</p>
            </div>
          </div>
          <nav className="base-sidebar__nav" aria-label="Điều hướng chính">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `base-sidebar__link ${isActive ? "base-sidebar__link--active" : ""}`
                }
              >
                {item.icon != null && (
                  <span className="base-sidebar__icon" aria-hidden>
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="base-sidebar__footer">Chơi là học</div>
        </aside>
      )}

      <div className="base-main-wrapper">
        <Header
          crumbs={crumbs}
          showLogout={showLogout}
          onMenuToggle={hasSidebar ? () => setSidebarOpen((o) => !o) : undefined}
          menuOpen={sidebarOpen}
        />

        <main
          className="base-main-content animate-fadeIn"
          role="main"
          id="main-content"
        >
          <div className="base-content-container">
            <Outlet />
          </div>
        </main>

        <footer className="base-footer">
          <div className="base-footer__container">
            <div className="base-footer__info">
              <p className="base-footer__title">🎯 Web_Quiz</p>
              <p className="base-footer__desc">
                Trải nghiệm quiz thời gian thực — giao diện lấy cảm hứng từ Kahoot, phù hợp
                host và người chơi.
              </p>
            </div>
            <p className="base-footer__copy">
              © {new Date().getFullYear()} Web_Quiz
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BaseLayout;
