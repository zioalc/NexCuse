import { Link } from "react-router-dom"
import DescriptionBullets from "../components/DescriptionBullets.jsx"

export default function Landing({ options }) {
  const preview = (options ?? []).slice(0, 4)

  return (
    <div className="landing">
      <section className="landing-hero panel">
        <p className="landing-kicker">NexCuse</p>
        <h2 className="landing-title">Pick a workout focus. Track it on your calendar.</h2>
        <p className="sub landing-lead">
          Sign in to save your plan, sync across sessions, and edit days anytime—no
          spreadsheets, no guesswork.
        </p>
        <div className="actions landing-actions">
          <Link className="btn primary" to="/login">
            Log in
          </Link>
          <Link className="btn" to="/signup">
            Create account
          </Link>
        </div>
        <p className="footer-note landing-hint">
          New here? Creating an account takes under a minute.
        </p>
      </section>

      <section className="landing-preview" aria-label="Preview of workout options">
        <h3 className="landing-preview-title">What you’ll unlock</h3>
        <div className="cards">
          {preview.map((option) => (
            <div className="card" key={option.id}>
              <strong>{option.title}</strong>
              <div className="tag">{option.category}</div>
              <DescriptionBullets text={option.description} variant="preview" />
              <div className="card-actions">
                <Link className="btn" to={`/options/${option.id}`}>
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
