import { useEffect, useMemo, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import Calendar from "./pages/Calendar.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Login from "./pages/Login.jsx"
import NotFound from "./pages/NotFound.jsx"
import OptionDetail from "./pages/OptionDetail.jsx"
import Signup from "./pages/Signup.jsx"
import { initialCalendarEntries } from "./data/calendar.js"
import { workoutOptions } from "./data/options.js"

const initialUser = { name: "Xio", status: "Logged in (mock)" }
const defaultSelectedDate = "2026-02-03"

function App() {
  const [theme, setTheme] = useState("dark")
  const [user, setUser] = useState(initialUser)
  const [todayOptionId, setTodayOptionId] = useState(3)
  const [calendarEntries, setCalendarEntries] = useState(
    initialCalendarEntries,
  )
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate)

  useEffect(() => {
    document.body.dataset.theme = theme
    document.documentElement.dataset.theme = theme
  }, [theme])

  const options = useMemo(() => workoutOptions, [])

  const handleUpdateEntry = (date, optionId, status) => {
    setCalendarEntries((prev) => ({
      ...prev,
      [date]: { optionId, status },
    }))
  }

  const handleRemoveEntry = (date) => {
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
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Layout
        user={user}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogout={handleLogout}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                options={options}
                todayOptionId={todayOptionId}
                onSelectTodayOption={setTodayOptionId}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <Calendar
                options={options}
                calendarEntries={calendarEntries}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onUpdateEntry={handleUpdateEntry}
                onRemoveEntry={handleRemoveEntry}
              />
            }
          />
          <Route
            path="/options/:id"
            element={
              <OptionDetail options={options} onUpdateEntry={handleUpdateEntry} />
            }
          />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/signup" element={<Signup onLogin={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
