import { useMemo } from "react"
import { Link } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"
import DescriptionBullets from "../components/DescriptionBullets.jsx"
import { getOptionLabel } from "../data/options.js"

export default function Dashboard({
  options,
  todayOptionId,
  onSelectTodayOption,
}) {
  const todayOption = useMemo(
    () => options.find((option) => option.id === todayOptionId),
    [options, todayOptionId],
  )

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
              {todayOption?.description ? (
                <DescriptionBullets text={todayOption.description} variant="compact" />
              ) : (
                <div className="meta">Pick an option below.</div>
              )}
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
                <strong>{option.title}</strong>
                <div className="tag">{option.category}</div>
                {option.description ? (
                  <DescriptionBullets text={option.description} variant="compact" />
                ) : null}
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
    </>
  )
}
