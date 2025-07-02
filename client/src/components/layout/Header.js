import React, { useContext, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);

  const onLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const handleSettingsToggle = () => {
    setSettingsOpen((v) => {
      if (!v) setEmailDropdownOpen(false);
      return !v;
    });
  };
  const handleEmailDropdownToggle = () => {
    setEmailDropdownOpen((v) => {
      if (!v) setSettingsOpen(false);
      return !v;
    });
  };

  const adminNav = (
    <>
      {auth.user && auth.user.role === "admin" && (
        <>
          <NavLink className="nav-link" to="/admin/grievances">
            View Grievances
          </NavLink>
          <div className="nav-item dropdown">
            <span
              onClick={handleSettingsToggle}
              className="nav-link dropdown-toggle"
              role="button"
              aria-expanded={settingsOpen}
              style={{ cursor: "pointer" }}
            >
              Settings
            </span>
            <ul className={`dropdown-menu${settingsOpen ? " show" : ""}`}>
              <li>
                <NavLink
                  className="dropdown-item"
                  to="/admin/settings/admins"
                  onClick={() => setSettingsOpen(false)}
                  end
                >
                  Admin Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="dropdown-item"
                  to="/admin/settings/citizens"
                  onClick={() => setSettingsOpen(false)}
                  end
                >
                  Citizen Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="dropdown-item"
                  to="/admin/settings/departments"
                  onClick={() => setSettingsOpen(false)}
                  end
                >
                  Departments
                </NavLink>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const authLinks = auth.isAuthenticated ? adminNav : null;

  const guestLinks = (
    <>
      <Link className="nav-link" to="/login">
        Login
      </Link>
      <Link className="nav-link" to="/register">
        Register
      </Link>
    </>
  );

  React.useEffect(() => {
    if (!settingsOpen) return;
    function handleClick(e) {
      if (
        !document.querySelector(".dropdown-menu")?.contains(e.target) &&
        !document.querySelector(".dropdown-toggle")?.contains(e.target)
      ) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [settingsOpen]);

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          E-Grievance
        </Link>
        <nav className="navbar-nav ms-auto d-flex flex-row align-items-center gap-3">
          {auth.isAuthenticated ? (
            <>
              {authLinks}
              {auth.user && (
                <div className="nav-item dropdown ms-3 position-relative" style={{ minWidth: 0 }}>
                  <span
                    onClick={handleEmailDropdownToggle}
                    className="nav-link dropdown-toggle"
                    role="button"
                    aria-expanded={emailDropdownOpen}
                    style={{ cursor: "pointer" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="14" cy="14" r="14" fill="#e3eaf6" />
                      <circle cx="14" cy="11" r="5" fill="#3498db" />
                      <ellipse cx="14" cy="21" rx="7" ry="4" fill="#bcd2ee" />
                    </svg>
                  </span>
                  <ul
                    className={`dropdown-menu dropdown-menu-end w-auto${emailDropdownOpen ? " show" : ""}`}
                    style={{ right: 0, left: "auto", minWidth: 120, maxWidth: 200 }}
                  >
                    <li>
                      <button className="dropdown-item" onClick={onLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="d-flex gap-2">{guestLinks}</div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
