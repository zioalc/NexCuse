import { useId, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"

export default function Login({ onLogin, user }) {
  const navigate = useNavigate()
  const emailId = useId()
  const passwordId = useId()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (user?.token) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data.error ?? "Login failed.")
        return
      }
      localStorage.setItem("token", data.token)
      const displayName =
        data.user?.email?.split("@")[0] || email.split("@")[0] || "Friend"
      onLogin({
        name: displayName,
        email: data.user.email,
        status: "Logged in",
        token: data.token,
      })
      navigate("/", { replace: true })
    } catch {
      setMessage("Network error. Is the API running on port 3000?")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Topbar
        title="Log in"
        actions={
          <Link className="btn" to="/">
            Home
          </Link>
        }
      />

      <section className="grid">
        <article className="panel col-6">
          <form className="list" style={{ gap: "12px" }} onSubmit={handleSubmit}>
            <label className="auth-field" htmlFor={emailId}>
              <span className="auth-field-label">Email address</span>
              <input
                id={emailId}
                type="email"
                placeholder="email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="auth-field" htmlFor={passwordId}>
              <span className="auth-field-label">Password</span>
              <input
                id={passwordId}
                type="password"
                placeholder="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <div className="actions">
              <button className="primary" type="submit" disabled={submitting}>
                {submitting ? "Signing in…" : "Log in"}
              </button>
              <Link className="btn" to="/signup">
                Need an account?
              </Link>
            </div>
            {message ? (
              <p className="footer-note" aria-live="polite">
                {message}
              </p>
            ) : null}
          </form>
        </article>

        <article className="panel col-6">
          <h3>What this app does</h3>
          <p className="sub">
            NexCuse helps you choose from 8 preset workout day options and track
            them on a calendar.
          </p>
          <ul className="list">
            <li className="item">
              <div>
                <strong>Pick a focus</strong>
                <div className="meta">Legs, Pull, Push, Core…</div>
              </div>
              <span className="item-note">Simple</span>
            </li>
            <li className="item">
              <div>
                <strong>Add to calendar</strong>
                <div className="meta">Create / replace / remove per day</div>
              </div>
              <span className="item-note">MVP</span>
            </li>
          </ul>
        </article>
      </section>
    </>
  )
}
