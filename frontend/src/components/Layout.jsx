import Sidebar from "./Sidebar.jsx"

export default function Layout({
  children,
  user,
  theme,
  onToggleTheme,
  onLogout,
  banner,
  banners,
  loadingNotice,
}) {
  const list = banners?.length
    ? banners
    : banner
      ? [banner]
      : []

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
            {list.length > 0 ? (
              <div
                className="app-banners"
                role="region"
                aria-label="Alerts and notices"
              >
                {list.map((msg, i) => (
                  <p
                    key={`${i}-${msg.slice(0, 24)}`}
                    className="app-banner app-banner--error"
                    role="alert"
                  >
                    {msg}
                  </p>
                ))}
              </div>
            ) : null}
            {loadingNotice ? (
              <p
                className="app-banner app-banner--loading"
                aria-live="polite"
              >
                {loadingNotice}
              </p>
            ) : null}
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
