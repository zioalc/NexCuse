import { useId, useState } from "react"
import { Link } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"

export default function Login({ onLogin }) {
  const emailId = useId()
  const passwordId = useId()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = email.split("@")[0] || "Friend"
    onLogin({ name, status: "Logged in (mock)" })
    setMessage("Logged in locally (mock).")
  }

  return (
    <>
      <Topbar
        title="Log in"
        subtitle="Static form for milestone (mock login)."
        actions={
          <Link className="btn" to="/">
            Continue as logged-in (mock)
          </Link>
        }
      />

      <section className="grid">
        <article className="panel col-6">
          <h3>Account</h3>
          <form className="list" style={{ gap: "12px" }} onSubmit={handleSubmit}>
            <label htmlFor={emailId}>Email</label>
            <input
              id={emailId}
              type="email"
              placeholder="zio@example.com"
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
                Log in
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
              <span className="badge">Simple</span>
            </li>
            <li className="item">
              <div>
                <strong>Add to calendar</strong>
                <div className="meta">Create / replace / remove per day</div>
              </div>
              <span className="badge">MVP</span>
            </li>
          </ul>
        </article>
      </section>
    </>
  )
}
