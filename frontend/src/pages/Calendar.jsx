import { useEffect, useMemo, useState } from "react"
import Topbar from "../components/Topbar.jsx"
import { getOptionLabel } from "../data/options.js"
import { monthMeta } from "../data/calendar.js"

const statusOptions = ["Planned", "Completed", "Skipped"]

const getDateKey = (day) =>
  `${monthMeta.year}-${String(2).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`

export default function Calendar({
  options,
  calendarEntries,
  selectedDate,
  setSelectedDate,
  onUpdateEntry,
  onRemoveEntry,
}) {
  const [optionId, setOptionId] = useState(options[0]?.id ?? 1)
  const [status, setStatus] = useState(statusOptions[0])
  const [savedMessage, setSavedMessage] = useState("")

  const selectedEntry = useMemo(
    () => calendarEntries[selectedDate],
    [calendarEntries, selectedDate],
  )

  useEffect(() => {
    if (selectedEntry) {
      setOptionId(selectedEntry.optionId)
      setStatus(selectedEntry.status)
    } else {
      setOptionId(options[0]?.id ?? 1)
      setStatus(statusOptions[0])
    }
    setSavedMessage("")
  }, [options, selectedEntry, selectedDate])

  const getOptionById = (id) => options.find((option) => option.id === id)
  const fallbackOption = options[0] ?? { name: "Option", tag: "Unknown" }

  const days = Array.from({ length: monthMeta.daysInMonth }, (_, index) => {
    const day = index + 1
    const dateKey = getDateKey(day)
    return {
      day,
      dateKey,
      entry: calendarEntries[dateKey],
    }
  })

  const handleSave = () => {
    onUpdateEntry(selectedDate, optionId, status)
    setSavedMessage("Saved to calendar (mock).")
  }

  const handleRemove = () => {
    onRemoveEntry(selectedDate)
    setSavedMessage("Removed from calendar (mock).")
  }

  return (
    <>
      <Topbar
        title="Calendar"
        subtitle="Add, replace, or remove a workout option for a date."
        actions={
          <>
            <button className="btn primary" type="button" onClick={handleSave}>
              + Add to selected date
            </button>
          </>
        }
      />

      <section className="grid" aria-label="Calendar content">
        <article className="panel col-8">
          <h3>
            {monthMeta.label} (locked view)
          </h3>

          <div className="calendar" aria-label="Month calendar grid">
            <div className="dayname">Sun</div>
            <div className="dayname">Mon</div>
            <div className="dayname">Tue</div>
            <div className="dayname">Wed</div>
            <div className="dayname">Thu</div>
            <div className="dayname">Fri</div>
            <div className="dayname">Sat</div>

            {days.map((day) => (
              <button
                key={day.dateKey}
                className={`day${
                  selectedDate === day.dateKey ? " is-selected" : ""
                }`}
                type="button"
                onClick={() => setSelectedDate(day.dateKey)}
              >
                <strong>{day.day}</strong>
                {day.entry ? (
                  <div className="mini">
                    <span
                      className={`badge${
                        day.entry.status === "Planned" ? " accent" : ""
                      }${day.entry.status === "Completed" ? " done" : ""}`}
                    >
                      {getOptionLabel(
                        getOptionById(day.entry.optionId) ?? fallbackOption,
                      )}
                    </span>
                    <span
                      className={`badge${
                        day.entry.status === "Completed" ? " done" : ""
                      }`}
                    >
                      {day.entry.status}
                    </span>
                  </div>
                ) : null}
              </button>
            ))}
          </div>

          <p className="footer-note">
            Mocked data shown on Feb 2 / Feb 3 / Feb 6 (3+ instances), as required.
          </p>
        </article>

        <article className="panel col-4">
          <h3>Edit selected date (mock)</h3>
          <p className="sub">Selected date: {selectedDate}</p>

          <form className="list" style={{ gap: "12px" }}>
            <label>
              Date
              <input type="text" value={selectedDate} readOnly />
            </label>

            <label>
              Workout option
              <select
                value={optionId}
                onChange={(event) => setOptionId(Number(event.target.value))}
              >
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {getOptionLabel(option)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Completion (optional MVP-safe)
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
              <button className="primary" type="button" onClick={handleSave}>
                Replace selection
              </button>
              <button type="button" onClick={handleRemove}>
                Remove from date
              </button>
            </div>
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
