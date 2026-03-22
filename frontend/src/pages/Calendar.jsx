import { useEffect, useMemo, useState } from "react"
import DescriptionBullets from "../components/DescriptionBullets.jsx"
import Topbar from "../components/Topbar.jsx"
import { getOptionLabel } from "../data/options.js"
import {
  addMonths,
  daysInMonth,
  firstWeekdayOfMonth,
  formatMonthYear,
  parseISODateLocal,
  startOfMonth,
  startOfDay,
  toISODate,
} from "../utils/dateUtils.js"

const statusOptions = ["Planned", "Completed", "Skipped"]

export default function Calendar({
  options,
  calendarEntries,
  selectedDate,
  setSelectedDate,
  onUpdateEntry,
  onRemoveEntry,
  user,
}) {
  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(parseISODateLocal(selectedDate)),
  )
  const [optionId, setOptionId] = useState(options[0]?.id ?? 1)
  const [status, setStatus] = useState(statusOptions[0])
  const [savedMessage, setSavedMessage] = useState("")

  const year = viewMonth.getFullYear()
  const monthIndex = viewMonth.getMonth()
  const dim = daysInMonth(year, monthIndex)
  const leadingPads = firstWeekdayOfMonth(year, monthIndex)

  const minDateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`
  const maxDateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dim).padStart(2, "0")}`

  const todayKey = toISODate(startOfDay(new Date()))

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

  useEffect(() => {
    const sel = parseISODateLocal(selectedDate)
    setViewMonth((vm) => {
      if (
        sel.getFullYear() === vm.getFullYear() &&
        sel.getMonth() === vm.getMonth()
      ) {
        return vm
      }
      return startOfMonth(sel)
    })
  }, [selectedDate])

  const getOptionById = (id) => options.find((option) => option.id === id)
  const fallbackOption = options[0] ?? {
    title: "Option",
    category: "Unknown",
  }

  const dayCells = useMemo(() => {
    const cells = []
    for (let day = 1; day <= dim; day += 1) {
      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      cells.push({
        day,
        dateKey,
        entry: calendarEntries[dateKey],
      })
    }
    return cells
  }, [year, monthIndex, dim, calendarEntries])

  const handleSave = () => {
    onUpdateEntry(selectedDate, optionId, status)
    setSavedMessage(
      user?.token ? "Saved to your calendar." : "Saved locally.",
    )
  }

  const handleRemove = () => {
    onRemoveEntry(selectedDate)
    setSavedMessage(
      user?.token ? "Removed from your calendar." : "Removed locally.",
    )
  }

  const goPrevMonth = () => {
    setViewMonth((m) => addMonths(m, -1))
  }

  const goNextMonth = () => {
    setViewMonth((m) => addMonths(m, 1))
  }

  const goToToday = () => {
    const t = startOfDay(new Date())
    setViewMonth(startOfMonth(t))
    setSelectedDate(toISODate(t))
  }

  const activePlanOption = getOptionById(optionId)

  return (
    <>
      <Topbar
        title="Calendar"
        subtitle="Dates use your device clock — tap a day or pick a date below."
        actions={
          <button className="btn" type="button" onClick={goToToday}>
            Today
          </button>
        }
      />

      <section className="grid" aria-label="Calendar content">
        <article className="panel col-8">
          <div className="calendar-month-head">
            <h3>{formatMonthYear(viewMonth)}</h3>
            <div className="calendar-month-nav">
              <button type="button" className="btn" onClick={goPrevMonth}>
                ← Prev
              </button>
              <button type="button" className="btn" onClick={goNextMonth}>
                Next →
              </button>
            </div>
          </div>

          <div className="calendar" aria-label="Month calendar grid">
            <div className="dayname">Sun</div>
            <div className="dayname">Mon</div>
            <div className="dayname">Tue</div>
            <div className="dayname">Wed</div>
            <div className="dayname">Thu</div>
            <div className="dayname">Fri</div>
            <div className="dayname">Sat</div>

            {Array.from({ length: leadingPads }, (_, i) => (
              <div key={`pad-${i}`} className="calendar-pad" aria-hidden />
            ))}

            {dayCells.map((day) => (
              <button
                key={day.dateKey}
                className={`day${
                  selectedDate === day.dateKey ? " is-selected" : ""
                }${day.dateKey === todayKey ? " is-today" : ""}`}
                type="button"
                onClick={() => setSelectedDate(day.dateKey)}
              >
                <strong>{day.day}</strong>
                {day.entry ? (
                  <div className="mini">
                    <span className="day-entry-workout">
                      {getOptionLabel(
                        getOptionById(day.entry.optionId) ?? fallbackOption,
                      )}
                    </span>
                    <span
                      className={`day-entry-status day-entry-status--${day.entry.status.toLowerCase()}`}
                    >
                      {day.entry.status}
                    </span>
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        </article>

        <article className="panel col-4 calendar-plan-panel">
          <h3>Add a workout option to a day</h3>
          <p className="sub calendar-plan-lead">
            This form is where you <strong>attach one workout choice</strong> to a{" "}
            <strong>single calendar day</strong>. First click a day in the grid (or
            use <strong>Today</strong>), then choose the option and status here and
            save.
          </p>

          <details className="calendar-help-details">
            <summary className="calendar-help-summary">
              New to NexCuse? Show step-by-step help
            </summary>
            <div className="calendar-help-inner">
              <p className="sub calendar-help-intro">
                Follow these steps once; you can open this section anytime.
              </p>
              <ol
                className="calendar-help-steps"
                aria-label="Steps to add a workout"
              >
                <li>
                  <strong>Select a day</strong> — click it in the grid, use{" "}
                  <strong>Today</strong> at the top, or pick a date in the form
                  (only dates in the month you&apos;re viewing).
                </li>
                <li>
                  <strong>Choose workout &amp; status</strong> — the type of day
                  (legs, push, etc.) and whether it&apos;s planned, completed, or
                  skipped.
                </li>
                <li>
                  <strong>Save</strong> — your plan is stored here; when you&apos;re
                  logged in it also saves to your account.
                </li>
              </ol>
            </div>
          </details>

          <p className="calendar-form-heading" id="calendar-form-label">
            Which day &amp; which option?
          </p>

          <form
            className="list calendar-plan-form"
            style={{ gap: "12px" }}
            aria-labelledby="calendar-form-label"
          >
            <label htmlFor="calendar-date-picker">
              <span className="label-title">Day</span>
              <input
                id="calendar-date-picker"
                type="date"
                min={minDateStr}
                max={maxDateStr}
                value={selectedDate}
                onChange={(event) => {
                  const v = event.target.value
                  setSelectedDate(v)
                  setViewMonth(startOfMonth(parseISODateLocal(v)))
                }}
              />
            </label>

            <label>
              <span className="label-title">Workout type</span>
              <span className="label-hint">
                One of eight preset focuses (legs, push, cardio, etc.).
              </span>
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
              {activePlanOption?.description ? (
                <DescriptionBullets
                  text={activePlanOption.description}
                  variant="compact"
                />
              ) : null}
            </label>

            <label>
              <span className="label-title">Status</span>
              <span className="label-hint">
                Planned = upcoming, Completed = you did it, Skipped = you didn&apos;t.
              </span>
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
                Save for this day
              </button>
              <button type="button" onClick={handleRemove}>
                Clear this day
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
