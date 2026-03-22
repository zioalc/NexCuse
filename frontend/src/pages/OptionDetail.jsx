import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"
import DescriptionBullets from "../components/DescriptionBullets.jsx"
import { getOptionLabel } from "../data/options.js"
import { startOfDay, toISODate } from "../utils/dateUtils.js"

const statusOptions = ["Planned", "Completed", "Skipped"]

export default function OptionDetail({ options, onUpdateEntry, user }) {
  const { id } = useParams()
  const option = useMemo(
    () => options.find((item) => String(item.id) === String(id)),
    [id, options],
  )

  const dateOptions = useMemo(() => {
    const base = startOfDay(new Date())
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      return toISODate(d)
    })
  }, [])

  const [selectedDate, setSelectedDate] = useState(() =>
    toISODate(startOfDay(new Date())),
  )
  const [status, setStatus] = useState(statusOptions[0])
  const [savedMessage, setSavedMessage] = useState("")

  const handleAdd = () => {
    if (!option) return
    onUpdateEntry(selectedDate, option.id, status)
    setSavedMessage("Added to your calendar.")
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
          <DescriptionBullets text={option.description} variant="detail" />
        </article>

        <article className="panel col-6">
          {!user?.token ? (
            <>
              <h3>Add to your calendar</h3>
              <p className="sub">
                Sign in to save this workout to a date and keep it across sessions.
              </p>
              <div className="actions">
                <Link className="btn primary" to="/login">
                  Log in
                </Link>
                <Link className="btn" to="/signup">
                  Create account
                </Link>
              </div>
            </>
          ) : (
            <>
              <h3>Add to calendar</h3>
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
              </form>
              {savedMessage ? (
                <p className="footer-note" aria-live="polite">
                  {savedMessage}
                </p>
              ) : null}
            </>
          )}
        </article>
      </section>
    </>
  )
}
