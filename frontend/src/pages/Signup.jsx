import { useId, useState } from "react"
import { Link } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"

export default function Signup({ onLogin }) {
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    const userName = name || email.split("@")[0] || "Friend"
    onLogin({ name: userName, status: "Logged in (mock)" })
    setMessage("Account created locally (mock).")
  }

  return (
    <>
      <Topbar
        title="Create account"
        subtitle="Static form for milestone (mock signup)."
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
            <label htmlFor={nameId}>Name</label>
            <input
              id={nameId}
              type="text"
              placeholder="username/name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <label htmlFor={emailId}>Email</label>
            <input
              id={emailId}
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor={passwordId}>Password</label>
            <input
              id={passwordId}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className="actions">
              <button className="primary" type="submit">
                Create account
              </button>
              <Link className="btn" to="/">
                Continue to app (mock)
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
              <span className="badge">Read</span>
            </li>
            <li className="item">
              <div>
                <strong>Add/replace/remove</strong>
                <div className="meta">
                  Per-date workout selection on calendar
                </div>
              </div>
              <span className="badge">CRUD</span>
            </li>
            <li className="item">
              <div>
                <strong>View stretch guides</strong>
                <div className="meta">Leg & Arm stretches</div>
              </div>
              <span className="badge">Guide</span>
            </li>
          </ul>
        </article>
      </section>
    </>
  )
}
