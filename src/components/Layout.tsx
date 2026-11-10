import { useEffect, useRef } from 'react'
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom'
import { ArrowUpRight, BookOpen, Grid2X2, GraduationCap } from 'lucide-react'
import { categories } from '../content'
import { Icon } from './Icon'
export function Layout() {
  const { pathname, hash } = useLocation()
  const main = useRef<HTMLElement>(null)
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
      main.current?.focus()
    }
  }, [pathname, hash])
  return <div className="app-shell">
    <a className="skip-link" href="#inhalt">Zum Inhalt springen</a>
    <aside className="sidebar">
      <Link to="/" className="brand" aria-label="RE Academy – Startseite"><span className="brand-icon"><GraduationCap size={25} /></span><span>RE<span className="brand-light"> Academy</span><small>WISSEN. VERSTEHEN. ANWENDEN.</small></span></Link>
      <div className="nav-label">DEIN LERNRAUM</div>
      <nav aria-label="Hauptnavigation"><NavLink to="/" end className="dashboard-nav"><Grid2X2 size={19} /> Übersicht</NavLink><div className="nav-label category-label">LERNBEREICHE</div>{categories.map(category => <NavLink key={category.id} to={`/kategorien/${category.id}`}><Icon name={category.icon} size={19} /><span>{category.title}</span></NavLink>)}</nav>
      <div className="sidebar-note"><span className="note-icon"><BookOpen size={20} /></span><strong>Kleine Schritte.<br />Großes Verständnis.</strong><p>Ein paar Minuten Wissen für deinen nächsten Projekttag.</p><Link to="/lektionen/re-einfuehrung">Jetzt loslegen <ArrowUpRight size={16} /></Link></div>
      <div className="sidebar-footer"><span className="status-dot" /> MVP v0.1 <span>Für deinen Projektalltag</span></div>
    </aside>
    <div className="main-shell"><header className="topbar"><span>Dein Wissen. Dein nächster Schritt.</span><span className="internal-tag"><span className="status-dot" /> Interne Lernplattform</span></header><main id="inhalt" ref={main} tabIndex={-1}><Outlet /></main><footer className="page-footer"><span>RE Academy</span><span>Mit Neugier beginnt Veränderung.</span><span>Version 0.1</span></footer></div>
  </div>
}
