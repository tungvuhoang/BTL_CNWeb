import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";

const Header = ({
  crumbs = [],
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
    <header className="base-header">
      <a className="skip-link" href="#main-content">
        Bỏ qua đến nội dung
      </a>
      <div className="base-header__container">
        <div className="base-header__left">
          {onMenuToggle && (
            <button
              type="button"
              className="base-header__menu-btn"
              aria-expanded={menuOpen}
              aria-controls="host-sidebar"
              onClick={onMenuToggle}
            >
              <span className="sr-only">Mở menu điều hướng</span>
              <span className="base-header__hamburger" aria-hidden>
                <span className={`base-header__bar ${menuOpen ? "open" : ""}`} />
                <span className={`base-header__bar ${menuOpen ? "open" : ""}`} />
                <span className={`base-header__bar ${menuOpen ? "open" : ""}`} />
              </span>
            </button>
          )}
          <nav aria-label="Breadcrumb" className="base-header__breadcrumb">
            <ol className="base-header__breadcrumb-list">
              {crumbs.map((c, i) => {
                const last = i === crumbs.length - 1;
                return (
                  <li key={`${c.label}-${i}`} className="base-header__breadcrumb-item">
                    {i > 0 && <span className="base-header__breadcrumb-separator">/</span>}
                    {last || !c.to ? (
                      <span className="base-header__breadcrumb-current">{c.label}</span>
                    ) : (
                      <Link to={c.to} className="base-header__breadcrumb-link">
                        {c.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        <nav aria-label="Thanh công cụ" className="base-header__toolbar">
          <ul className="base-header__toolbar-list">
            {username && (
              <li className="base-header__username">
                {username}
              </li>
            )}
            {showLogout && (
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="base-header__logout-btn"
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
