import Sidebar from "./Sidebar.jsx"

export default function Layout({
  children,
  user,
  theme,
  onToggleTheme,
  onLogout,
  banner,
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
          <div className="container">
            {banner ? (
              <p
                className="footer-note"
                role="alert"
                style={{ color: "var(--error-text)", marginBottom: "var(--s3)" }}
              >
                {banner}
              </p>
            ) : null}
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
