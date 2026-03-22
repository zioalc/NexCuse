import { useId, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"

export default function Signup({ onLogin, user }) {
  const navigate = useNavigate()
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const [name, setName] = useState("")
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data.error ?? "Could not create account.")
        return
      }
      localStorage.setItem("token", data.token)
      const displayName =
        name.trim() ||
        data.user?.email?.split("@")[0] ||
        email.split("@")[0] ||
        "Friend"
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
        title="Create account"
        subtitle="Register to save your calendar on the server."
        actions={
          <Link className="btn" to="/login">
            Already have an account?
          </Link>
        }
      />

      <section className="grid">
        <article className="panel col-6">
          <h3>Sign up</h3>
          <form className="list" style={{ gap: "12px" }} onSubmit={handleSubmit}>
            <label htmlFor={nameId}>Display name (optional)</label>
            <input
              id={nameId}
              type="text"
              placeholder="username/name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="nickname"
            />
            <label htmlFor={emailId}>Email</label>
            <input
              id={emailId}
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
            <label htmlFor={passwordId}>Password</label>
            <input
              id={passwordId}
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <div className="actions">
              <button className="primary" type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create account"}
              </button>
              <Link className="btn" to="/">
                Home
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
          <h3>What you can do (MVP)</h3>
          <ul className="list">
            <li className="item">
              <div>
                <strong>See 8 preset options</strong>
                <div className="meta">
                  Legs, Pull, Core, Upper, Push, Full Body, Cardio, Rest
                </div>
              </div>
              <span className="item-note">Read</span>
            </li>
            <li className="item">
              <div>
                <strong>Add/replace/remove</strong>
                <div className="meta">
                  Per-date workout selection on calendar
                </div>
              </div>
              <span className="item-note">CRUD</span>
            </li>
            <li className="item">
              <div>
                <strong>View stretch guides</strong>
                <div className="meta">Leg & Arm stretches</div>
              </div>
              <span className="item-note">Guide</span>
            </li>
          </ul>
        </article>
      </section>
    </>
  )
}
