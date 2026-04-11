import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { getHostBreadcrumbs } from "../utils/hostBreadcrumbs";
import "./BaseLayout.css";

/**
 * App shell: optional sidebar, breadcrumbs from route `handle.crumb`,
 * themed main + footer. Mobile drawer for sidebar.
 * Breadcrumb dùng pathname (getHostBreadcrumbs) — không dùng useMatches với BrowserRouter.
 */
const BaseLayout = ({
  title,
  links = [],
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
    <div className="base-layout flex min-h-screen flex-col bg-slate-100 text-slate-900 lg:flex-row">
      {hasSidebar && sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-[1px] transition-opacity lg:hidden"
          aria-label="Đóng menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {hasSidebar && (
        <aside
          id="host-sidebar"
          className={`base-layout__sidebar fixed bottom-0 left-0 top-0 z-50 flex w-[min(17.5rem,88vw)] max-w-full flex-col border-r border-white/10 bg-gradient-host shadow-xl transition-transform duration-300 ease-out lg:static lg:z-0 lg:translate-x-0 lg:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-5">
            <span className="text-2xl" aria-hidden>
              🎮
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-kahoot-lime/90">
                Web_Quiz
              </p>
              <p className="text-sm font-bold text-white">Host</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Điều hướng chính">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-white text-kahoot-purple shadow-card translate-y-0"
                      : "text-white/90 hover:bg-white/10 hover:translate-x-0.5 active:scale-[0.98]",
                  ].join(" ")
                }
              >
                {item.icon != null && (
                  <span className="text-lg leading-none" aria-hidden>
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-white/10 p-3 text-center text-[11px] text-white/50">
            Chơi là học
          </div>
        </aside>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header
          title={title}
          links={links}
          showLogout={showLogout}
          onMenuToggle={hasSidebar ? () => setSidebarOpen((o) => !o) : undefined}
          menuOpen={sidebarOpen}
        />

        {crumbs.length > 0 && (
          <div
            className="border-b border-slate-200/80 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-sm sm:px-6 animate-slideUp"
            style={{ animationDelay: "40ms" }}
          >
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-600">
                {crumbs.map((c, i) => {
                  const last = i === crumbs.length - 1;
                  return (
                    <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                      {i > 0 && (
                        <span className="text-slate-400 select-none" aria-hidden>
                          /
                        </span>
                      )}
                      {last ? (
                        <span className="font-semibold text-kahoot-purple">{c.label}</span>
                      ) : (
                        <Link
                          to={c.to}
                          className="rounded-md font-medium text-slate-600 underline-offset-2 hover:text-kahoot-indigo hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-kahoot-indigo/40"
                        >
                          {c.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        )}

        <main
          className="base-layout__main flex-1 px-4 py-6 sm:px-6 lg:px-8"
          role="main"
          id="main-content"
        >
          <div className="mx-auto w-full max-w-6xl animate-fadeIn">
            <Outlet />
          </div>
        </main>

        <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-5 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-kahoot-purple">
                🎯 Web_Quiz
              </p>
              <p className="mt-1 max-w-md text-xs text-slate-500">
                Trải nghiệm quiz thời gian thực — giao diện lấy cảm hứng từ Kahoot, phù hợp
                host và người chơi.
              </p>
            </div>
            <p className="text-xs text-slate-400 sm:text-right">
              © {new Date().getFullYear()} Web_Quiz
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BaseLayout;
