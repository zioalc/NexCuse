import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import Calendar from "./pages/Calendar.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import GuestCalendarGate from "./pages/GuestCalendarGate.jsx"
import Landing from "./pages/Landing.jsx"
import Login from "./pages/Login.jsx"
import NotFound from "./pages/NotFound.jsx"
import OptionDetail from "./pages/OptionDetail.jsx"
import Signup from "./pages/Signup.jsx"
import { initialCalendarEntries } from "./data/calendar.js"
import { startOfDay, toISODate } from "./utils/dateUtils.js"

function entriesArrayToMap(entries) {
  const map = {}
  for (const row of entries) {
    map[row.date] = { optionId: row.optionId, status: row.status }
  }
  return map
}

export default function App() {
  const [theme, setTheme] = useState("light")
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [todayOptionId, setTodayOptionId] = useState(3)
  const [options, setOptions] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsError, setOptionsError] = useState(null)
  const [calendarEntries, setCalendarEntries] = useState(initialCalendarEntries)
  const [selectedDate, setSelectedDate] = useState(() =>
    toISODate(startOfDay(new Date())),
  )

  useEffect(() => {
    document.body.dataset.theme = theme
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    let cancelled = false
    setOptionsError(null)

    fetch("/api/options")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data?.options) ? data.options : []
        setOptions(list)
        if (import.meta.env.DEV) {
          console.log("[NexCuse] GET /api/options →", list.length, "option(s)")
        }
        if (list.length === 0) {
          setOptionsError(
            "No workout options returned. Seed the DB: npm run seed:options (from repo root), or check the workoutoptions collection in MongoDB.",
          )
        } else {
          setOptionsError(null)
        }
      })
      .catch((err) => {
        if (cancelled) return
        setOptions([])
        setOptionsError(
          "Could not load workout options. Start the API on port 3000 (npm run dev:backend or npm start) so Vite can proxy /api — or open the app from the same origin as the API.",
        )
        if (import.meta.env.DEV) {
          console.error("[NexCuse] GET /api/options failed:", err)
        }
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setAuthLoading(false)
      return
    }
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error("session")
        const data = await res.json()
        setUser({
          name: data.user.name,
          email: data.user.email,
          status: "Logged in",
          token,
        })
      })
      .catch(() => {
        localStorage.removeItem("token")
        setUser(null)
      })
      .finally(() => setAuthLoading(false))
  }, [])

  useEffect(() => {
    if (!user?.token) {
      setCalendarEntries(initialCalendarEntries)
      return
    }
    fetch("/api/calendar", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("calendar")
        const data = await res.json()
        setCalendarEntries(entriesArrayToMap(data.entries ?? []))
      })
      .catch(() => {
        setCalendarEntries({})
      })
  }, [user?.token])

  const handleUpdateEntry = async (date, optionId, status) => {
    const token = user?.token ?? localStorage.getItem("token")
    if (token) {
      const res = await fetch(
        `/api/calendar/${encodeURIComponent(date)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ optionId, status }),
        },
      )
      if (!res.ok) return
    }
    setCalendarEntries((prev) => ({
      ...prev,
      [date]: { optionId, status },
    }))
  }

  const handleRemoveEntry = async (date) => {
    const token = user?.token ?? localStorage.getItem("token")
    if (token) {
      const res = await fetch(`/api/calendar/${encodeURIComponent(date)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
    }
    setCalendarEntries((prev) => {
      if (!prev[date]) return prev
      const next = { ...prev }
      delete next[date]
      return next
    })
  }

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setCalendarEntries(initialCalendarEntries)
  }

  if (authLoading || optionsLoading) {
    return (
      <div className="container" style={{ padding: "2rem" }}>
        <p className="sub">Loading…</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Layout
        user={user}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
        banner={optionsError}
      >
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Dashboard
                  options={options}
                  todayOptionId={todayOptionId}
                  onSelectTodayOption={setTodayOptionId}
                />
              ) : (
                <Landing options={options} />
              )
            }
          />
          <Route
            path="/calendar"
            element={
              user ? (
                <Calendar
                  user={user}
                  options={options}
                  calendarEntries={calendarEntries}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  onUpdateEntry={handleUpdateEntry}
                  onRemoveEntry={handleRemoveEntry}
                />
              ) : (
                <GuestCalendarGate />
              )
            }
          />
          <Route
            path="/options/:id"
            element={
              <OptionDetail
                user={user}
                options={options}
                onUpdateEntry={handleUpdateEntry}
              />
            }
          />
          <Route path="/login" element={<Login user={user} onLogin={setUser} />} />
          <Route path="/signup" element={<Signup user={user} onLogin={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
