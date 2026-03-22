import { Link } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"

export default function GuestCalendarGate() {
  return (
    <>
      <Topbar
        title="Calendar"
        subtitle="Sign in to build and save your workout calendar."
      />
      <section className="grid" aria-label="Calendar sign-in prompt">
        <article className="panel col-12 guest-gate">
          <h3>Save your schedule</h3>
          <p className="sub">
            The calendar stores your picks per day on the server. Log in to add,
            replace, or remove workouts—and keep them after you close the browser.
          </p>
          <div className="actions">
            <Link className="btn primary" to="/login">
              Log in
            </Link>
            <Link className="btn" to="/signup">
              Create account
            </Link>
            <Link className="btn" to="/">
              Back to home
            </Link>
          </div>
        </article>
      </section>
    </>
  )
}
