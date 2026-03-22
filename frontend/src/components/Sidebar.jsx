import { NavLink } from "react-router-dom"

const getNavClass = ({ isActive }) =>
  isActive ? "nav-link is-active" : "nav-link"

export default function Sidebar({ user, theme, onToggleTheme, onLogout }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand">
        <div className="logo" aria-hidden="true">
          <img src="/nexcuse-icon.svg" alt="" width="40" height="40" decoding="async" />
        </div>
        <div className="brand-titles">
          <h1>NexCuse</h1>
          <p>workout picker + calendar</p>
        </div>
      </div>

      <nav className="nav">
        {user ? (
          <>
            <NavLink to="/" className={getNavClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/calendar" className={getNavClass}>
              Calendar
            </NavLink>
            <button
              type="button"
              className="nav-link nav-logout"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to log out?")
                ) {
                  onLogout()
                }
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" className={getNavClass} end>
              Home
            </NavLink>
            <NavLink to="/login" className={getNavClass}>
              Log in
            </NavLink>
            <NavLink to="/signup" className={getNavClass}>
              Sign up
            </NavLink>
          </>
        )}
      </nav>

      <div className="actions sidebar-actions">
        <button className="btn" type="button" onClick={onToggleTheme}>
          Switch to {theme === "dark" ? "light" : "dark"} mode
        </button>
      </div>

      {user ? (
        <div className="userbox" aria-label="Logged-in user">
          <div className="avatar" aria-hidden="true"></div>
          <div>
            <strong>Welcome back, {user.name}!</strong>
            <br />
            <small>{user.status}</small>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
