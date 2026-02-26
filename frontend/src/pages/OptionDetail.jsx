import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"
import { getOptionLabel } from "../data/options.js"

const dateOptions = [
  "2026-02-02",
  "2026-02-03",
  "2026-02-04",
  "2026-02-05",
  "2026-02-06",
]

const statusOptions = ["Planned", "Completed", "Skipped"]

export default function OptionDetail({ options, onUpdateEntry }) {
  const { id } = useParams()
  const option = useMemo(
    () => options.find((item) => String(item.id) === String(id)),
    [id, options],
  )

  const [selectedDate, setSelectedDate] = useState(dateOptions[1])
  const [status, setStatus] = useState(statusOptions[0])
  const [savedMessage, setSavedMessage] = useState("")

  const handleAdd = () => {
    if (!option) return
    onUpdateEntry(selectedDate, option.id, status)
    setSavedMessage("Added to calendar (mock).")
  }

  if (!option) {
    return (
      <>
        <Topbar
          title="Workout option details"
          subtitle="This option was not found."
          actions={
            <Link className="btn" to="/">
              Back to dashboard
            </Link>
          }
        />
        <section className="grid" aria-label="Option details content">
          <article className="panel col-12">
            <p className="sub">Try selecting a workout from the dashboard.</p>
          </article>
        </section>
      </>
    )
  }

  return (
    <>
      <Topbar
        title="Workout option details"
        subtitle="A short description + add to calendar (interactive)."
        actions={
          <>
            <Link className="btn" to="/">
              Back
            </Link>
            <Link className="btn primary" to="/calendar">
              Open calendar
            </Link>
          </>
        }
      />

      <section className="grid" aria-label="Option details content">
        <article className="panel col-6">
          <h3>{getOptionLabel(option)}</h3>
          <p className="sub">{option.focus}</p>

          <ul className="list">
            <li className="item">
              <div>
                <strong>Targets</strong>
                <div className="meta">{option.targets}</div>
              </div>
              <span className="badge">Preset</span>
            </li>
            <li className="item">
              <div>
                <strong>Example exercises (optional)</strong>
                <div className="meta">{option.exercises}</div>
              </div>
              <span className="badge">Optional</span>
            </li>
          </ul>
        </article>

        <article className="panel col-6">
          <h3>Add to calendar (mock)</h3>
          <form className="list" style={{ gap: "12px" }}>
            <label>
              Choose date
              <select
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              >
                {dateOptions.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Mark as (optional)
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {statusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </label>

            <div className="actions">
              <button className="primary" type="button" onClick={handleAdd}>
                Add to selected date
              </button>
              <Link className="btn" to="/">
                Cancel
              </Link>
            </div>

            <p className="footer-note">
              In the final app, this would create/update a DB record for that date.
            </p>
          </form>
          {savedMessage ? (
            <p className="footer-note" aria-live="polite">
              {savedMessage}
            </p>
          ) : null}
        </article>
      </section>
    </>
  )
}
