import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";

const Header = ({
  title,
  links = [],
  showLogout = true,
  onMenuToggle,
  menuOpen = false,
}) => {
  const { logout, username } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 border-b-4 border-kahoot-lime bg-gradient-host shadow-md">
      <a className="skip-link" href="#main-content">
        Bỏ qua đến nội dung
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:max-w-none lg:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {onMenuToggle && (
            <button
              type="button"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-kahoot-lime lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="host-sidebar"
              onClick={onMenuToggle}
            >
              <span className="sr-only">Mở menu điều hướng</span>
              <span className="flex flex-col gap-1.5" aria-hidden>
                <span
                  className={`block h-0.5 w-5 rounded-full bg-white transition ${
                    menuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-white transition ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-white transition ${
                    menuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          )}
          <div className="min-w-0">
            <h1 className="my-0 truncate text-lg font-extrabold tracking-tight text-white drop-shadow-sm sm:text-xl">
              {title}
            </h1>
            {username && (
              <p className="truncate text-xs font-medium text-white/80 sm:text-sm">
                Xin chào, <span className="font-semibold text-kahoot-lime">{username}</span>
              </p>
            )}
          </div>
        </div>

        <nav aria-label="Thanh công cụ">
          <ul className="flex list-none flex-wrap items-center justify-end gap-2 sm:gap-3">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.to}
                  className="inline-flex rounded-xl border-2 border-transparent px-3 py-2 text-sm font-semibold text-white/95 transition hover:border-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-kahoot-lime"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {showLogout && (
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center rounded-xl border-2 border-white bg-white px-3 py-2 text-sm font-bold text-kahoot-purple shadow-card transition hover:bg-kahoot-lime hover:text-kahoot-purple-deep hover:shadow-card-lg active:translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-kahoot-lime"
                >
                  Đăng xuất
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
