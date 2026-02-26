import { NavLink } from "react-router-dom"

const getNavClass = ({ isActive }) =>
  isActive ? "nav-link is-active" : "nav-link"

export default function Sidebar({ user, theme, onToggleTheme, onLogout }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand">
        <div className="logo" aria-hidden="true"></div>
        <div>
          <h1>NexCuse</h1>
          <p>workout picker + calendar</p>
        </div>
      </div>

      <nav className="nav">
        <NavLink to="/" className={getNavClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/calendar" className={getNavClass}>
          Calendar
        </NavLink>
        <NavLink to="/login" className={getNavClass}>
          Login
        </NavLink>
        <NavLink to="/signup" className={getNavClass}>
          Sign up
        </NavLink>
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
            <div className="user-actions">
              <button type="button" className="btn" onClick={onLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
