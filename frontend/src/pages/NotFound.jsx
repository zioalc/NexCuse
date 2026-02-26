import { Link } from "react-router-dom"
import Topbar from "../components/Topbar.jsx"

export default function NotFound() {
  return (
    <>
      <Topbar
        title="Page not found"
        subtitle="This route does not exist yet."
        actions={
          <Link className="btn" to="/">
            Return to dashboard
          </Link>
        }
      />
      <section className="grid">
        <article className="panel col-12">
          <p className="sub">
            Try using the navigation links to explore the MVP pages.
          </p>
        </article>
      </section>
    </>
  )
}
