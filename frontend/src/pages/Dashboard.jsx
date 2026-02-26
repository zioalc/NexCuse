import { useId, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"
import { getOptionLabel } from "../data/options.js"

const rolesList = [
  { value: "employer", label: "Employer" },
  { value: "peer", label: "Peer" },
  { value: "other", label: "Other" },
]

export default function Dashboard({
  options,
  todayOptionId,
  onSelectTodayOption,
}) {
  const emailId = useId()
  const messageId = useId()

  const [formState, setFormState] = useState({
    email: "",
    roles: [],
    message: "",
  })
  const [errors, setErrors] = useState({ email: "", roles: "" })
  const [submitted, setSubmitted] = useState("")

  const todayOption = useMemo(
    () => options.find((option) => option.id === todayOptionId),
    [options, todayOptionId],
  )

  const toggleRole = (value) => {
    setFormState((prev) => {
      const roles = prev.roles.includes(value)
        ? prev.roles.filter((role) => role !== value)
        : [...prev.roles, value]
      return { ...prev, roles }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = { email: "", roles: "" }
    if (!formState.email.trim()) {
      nextErrors.email = "Please enter an email address."
    }
    if (formState.roles.length === 0) {
      nextErrors.roles = "Please pick at least one role."
    }
    setErrors(nextErrors)
    if (!nextErrors.email && !nextErrors.roles) {
      setSubmitted("Message saved! (Mocked until reload.)")
    } else {
      setSubmitted("")
    }
  }

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Pick a workout day option and add it to your calendar."
        actions={
          <Link className="btn primary" to="/calendar">
            Open calendar
          </Link>
        }
      />

      <section className="grid" aria-label="Dashboard content">
        <article className="panel col-4">
          <h3>Today’s selection</h3>
          <div className="item">
            <div>
              <strong>{todayOption ? getOptionLabel(todayOption) : "None"}</strong>
              <div className="meta">
                {todayOption ? todayOption.targets : "Pick an option below."}
              </div>
            </div>
            <span className="badge accent">Planned</span>
          </div>

          <div className="footer-note">
            This preview uses local state so you can swap the selection.
          </div>
        </article>

        <article className="panel col-8">
          <h3>Your workout options ({options.length})</h3>
          <div className="cards" aria-label="Preset workout options">
            {options.map((option) => (
              <div className="card" key={option.id}>
                <strong>{option.name}</strong>
                <div className="tag">{option.tag}</div>
                <div className="card-actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => onSelectTodayOption(option.id)}
                  >
                    Use for today
                  </button>
                  <Link className="btn" to={`/options/${option.id}`}>
                    Open details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="contact-form" aria-label="Contact form">
        <h2>Contact Me</h2>
        <form id="contactForm" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor={emailId}>Email Address:</label>
            <input
              type="email"
              id={emailId}
              name="email"
              value={formState.email}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              required
            />
            <div className="error" aria-live="polite">
              {errors.email}
            </div>
          </div>

          <fieldset>
            <legend>What best describes yourself?</legend>
            {rolesList.map((role) => (
              <div key={role.value}>
                <input
                  type="checkbox"
                  id={`${emailId}-${role.value}`}
                  name="role"
                  value={role.value}
                  checked={formState.roles.includes(role.value)}
                  onChange={() => toggleRole(role.value)}
                />
                <label htmlFor={`${emailId}-${role.value}`}>{role.label}</label>
              </div>
            ))}
            <div className="error" aria-live="polite">
              {errors.roles}
            </div>
          </fieldset>

          <div>
            <label htmlFor={messageId}>Message:</label>
            <textarea
              id={messageId}
              name="message"
              value={formState.message}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  message: event.target.value,
                }))
              }
            ></textarea>
          </div>

          <input type="submit" value="Send Message" />
          {submitted ? (
            <p className="footer-note" aria-live="polite">
              {submitted}
            </p>
          ) : null}
        </form>
      </section>
    </>
  )
}
