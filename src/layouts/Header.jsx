import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ title, links = [], showLogout = true }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={{ background: "#2563eb", color: "#fff", padding: "10px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>{title}</h1>
        <nav>
          <ul style={{ display: "flex", listStyle: "none", gap: 20, margin: 0, padding: 0 }}>
            {links.map((link, index) => (
              <li key={index}>
                <Link to={link.to} style={{ color: "#fff", textDecoration: "none" }}>
                  {link.label}
                </Link>
              </li>
            ))}
            {showLogout && (
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Logout
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