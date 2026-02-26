import Sidebar from "./Sidebar.jsx"

export default function Layout({
  children,
  user,
  theme,
  onToggleTheme,
  onLogout,
}) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <div className="shell">
        <Sidebar
          user={user}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onLogout={onLogout}
        />
        <main className="main" id="main">
          <div className="container">{children}</div>
        </main>
      </div>
    </>
  )
}
