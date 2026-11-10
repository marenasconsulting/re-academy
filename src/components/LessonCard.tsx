import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, LockKeyhole } from 'lucide-react'
import type { Lesson } from '../content/types'
export function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const available = lesson.status === 'available'
  return <article className={`lesson-card ${available ? '' : 'planned'}`}><div className="lesson-number">{String(index + 1).padStart(2, '0')}</div><div className="lesson-card-content"><span className={`badge ${available ? 'available' : 'muted'}`}>{available ? 'Verfügbar' : 'Demnächst verfügbar'}</span><h3>{lesson.title}</h3><p>{lesson.introduction}</p><span className="duration"><Clock3 size={14} /> {lesson.duration} Min. {available && '· 5 Quizfragen'}</span></div>{available ? <Link className="button button-light" to={`/lektionen/${lesson.id}`}>Lektion öffnen <ArrowRight size={16} /></Link> : <span className="unavailable"><LockKeyhole size={16} /> In Vorbereitung</span>}</article>
}
