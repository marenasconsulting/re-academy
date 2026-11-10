import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
export function NotFound({ planned = false }: { planned?: boolean }) {
 return <div className="empty-state"><Compass size={44} /><p className="eyebrow">{planned ? 'BALD GEHT ES WEITER' : 'HIER GEHT ES NICHT WEITER'}</p><h1>{planned ? 'Diese Lektion entsteht gerade.' : 'Seite nicht gefunden.'}</h1><p>{planned ? 'Entdecke in der Zwischenzeit die bereits verfügbaren Lektionen.' : 'Die gesuchte Seite oder Lektion ist leider nicht verfügbar.'}</p><Link className="button button-primary" to="/">Zur Lernübersicht <ArrowRight size={16} /></Link></div>
}
