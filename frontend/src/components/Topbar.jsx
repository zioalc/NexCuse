export default function Topbar({ title, subtitle, actions }) {
  return (
    <header className="topbar">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p className="sub">{subtitle}</p> : null}
      </div>
      {actions ? <div className="actions">{actions}</div> : null}
    </header>
  )
}
