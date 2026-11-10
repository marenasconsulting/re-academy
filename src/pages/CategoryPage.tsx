import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { categories, lessons } from '../content'
import { Icon } from '../components/Icon'
import { LessonCard } from '../components/LessonCard'
import { NotFound } from './NotFound'
export function CategoryPage() {
  const { categoryId } = useParams()
  const category = categories.find(c => c.id === categoryId)
  if (!category) return <NotFound />
  const categoryLessons = lessons.filter(l => l.categoryId === category.id && (l.status === 'planned' || l.format === 'lesson'))
  const knowledge = lessons.filter(l => l.categoryId === category.id && l.status === 'available' && l.format === 'knowledge')
  return <>
    <Link className="back-link" to="/"><ArrowLeft size={16} /> Alle Lernbereiche</Link>
    <div className={`category-page-heading ${category.color}`}>
      <span className="category-icon"><Icon name={category.icon} size={30} /></span><p className="eyebrow">{category.label}</p><h1>{category.title}</h1><p>{category.description}</p>
      <span className="duration">{categoryLessons.filter(l => l.status === 'available').length} von {categoryLessons.length} Lektionen verfügbar{knowledge.length > 0 && ` · ${knowledge.length} Wissensartikel ohne Quiz`}</span>
      {knowledge.length > 0 && <a className="text-link knowledge-jump" href="#tools-methoden">Zu Tools & Methoden <ArrowLeft size={14} className="point-down" /></a>}
    </div>
    <section aria-labelledby="lessons-title"><div className="section-heading"><h2 id="lessons-title">Deine Lektionen</h2><span>Lesen und im Quiz festigen.</span></div><div className="lesson-list">{categoryLessons.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} index={index} />)}</div></section>
    {knowledge.length > 0 && <section id="tools-methoden" className="knowledge-section" aria-labelledby="knowledge-title"><div className="section-heading"><div><p className="eyebrow">DEIN NACHSCHLAGEWISSEN</p><h2 id="knowledge-title">Tools & Methoden</h2></div><span>{knowledge.length} Wissensartikel · Ohne Quiz</span></div><p className="knowledge-description">Methoden und Werkzeuge kompakt erklärt – mit Anwendung, Praxisbeispielen und Grenzen. Zum Lesen und Nachschlagen, ohne anschließendes Quiz.</p><div className="lesson-list">{knowledge.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} index={index} />)}</div></section>}
  </>
}
