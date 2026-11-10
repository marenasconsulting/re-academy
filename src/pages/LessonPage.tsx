import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock3, Lightbulb, ListChecks } from 'lucide-react'
import { categories, lessons, sources } from '../content'
import { NotFound } from './NotFound'
export function LessonPage() {
 const { lessonId } = useParams()
 const lesson = lessons.find(l => l.id === lessonId)
 if (!lesson) return <NotFound />
 if (lesson.status !== 'available') return <NotFound planned />
 const category = categories.find(c => c.id === lesson.categoryId)
 const knowledge = lesson.format === 'knowledge'
 const back = `/kategorien/${lesson.categoryId}${knowledge ? '#tools-methoden' : ''}`
 return <div className="reading-layout">
  <Link className="back-link" to={back}><ArrowLeft size={16} /> {category?.title}</Link>
  <p className="eyebrow">{knowledge ? 'TOOLS & METHODEN · WISSENSARTIKEL' : 'DEINE LEKTION · GRUNDLAGEN'}</p>
  <h1>{lesson.title}</h1>
  <div className="lesson-meta"><span><Clock3 size={16} /> {lesson.duration} Minuten</span><span>{knowledge ? <><BookOpen size={16} /> Wissen ohne Quiz</> : <><ListChecks size={16} /> {lesson.quiz.length} Quizfragen</>}</span></div>
  <p className="lesson-intro">{lesson.introduction}</p><div className="reading-divider" />
  <article>
   {lesson.sections.map((section, i) => <section className="reading-section" key={section.id}><span className="section-number">{String(i + 1).padStart(2, '0')}</span><div><h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}</div></section>)}
   <section className="example-box"><span className="eyebrow"><Lightbulb size={17} /> AUS DER PRAXIS</span><h2>{lesson.example.title}</h2><p>{lesson.example.text}</p></section>
   <section className="takeaway"><Check size={22} /><div><h2>Das nimmst du mit</h2><p>{lesson.takeaway}</p></div></section>
  </article>
  {knowledge ? <section className="quiz-cta"><div><h2>Wissen für deinen Projektalltag</h2><p>Diesen Artikel kannst du jederzeit nachschlagen. Es gibt dazu kein Quiz.</p></div><Link className="button button-light" to={back}>Weitere Themen <ArrowRight size={17} /></Link></section> : <section className="quiz-cta"><div><h2>Alles verstanden?</h2><p>Festige dein Wissen mit {lesson.quiz.length} kurzen Fragen.</p></div><Link className="button button-primary" to={`/lektionen/${lesson.id}/quiz`}>Quiz starten <ArrowRight size={17} /></Link></section>}
  <aside className="content-sources" aria-label="Quellen"><h2>Grundlage dieses Inhalts</h2><p>Für die RE Academy didaktisch aufbereitet. Beispiele dienen der Veranschaulichung.</p><ul>{lesson.sources.map(source => <li key={`${source.documentId}-${source.locator}`}><strong>{sources.find(s => s.id === source.documentId)?.title}</strong> · {source.locator}</li>)}</ul></aside>
 </div>
}
