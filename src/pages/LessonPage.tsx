import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Clock3, Lightbulb, ListChecks } from 'lucide-react'
import { categories, lessons } from '../content'
import { NotFound } from './NotFound'
export function LessonPage() {
 const { lessonId } = useParams()
 const lesson = lessons.find(l => l.id === lessonId)
 if (!lesson) return <NotFound />
 if (lesson.status !== 'available') return <NotFound planned />
 const category = categories.find(c => c.id === lesson.categoryId)
 return <div className="reading-layout"><Link className="back-link" to={`/kategorien/${lesson.categoryId}`}><ArrowLeft size={16} /> {category?.title}</Link><p className="eyebrow">DEINE LEKTION · GRUNDLAGEN</p><h1>{lesson.title}</h1><div className="lesson-meta"><span><Clock3 size={16} /> {lesson.duration} Minuten</span><span><ListChecks size={16} /> {lesson.quiz.length} Quizfragen</span></div><p className="lesson-intro">{lesson.introduction}</p><div className="reading-divider" /><article>{lesson.sections.map((section, i) => <section className="reading-section" key={section.id}><span className="section-number">0{i + 1}</span><div><h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}</div></section>)}<section className="example-box"><span className="eyebrow"><Lightbulb size={17} /> AUS DER PRAXIS</span><h2>{lesson.example.title}</h2><p>{lesson.example.text}</p></section><section className="takeaway"><Check size={22} /><div><h2>Das nimmst du mit</h2><p>{lesson.takeaway}</p></div></section></article><section className="quiz-cta"><div><h2>Alles verstanden?</h2><p>Festige dein Wissen mit {lesson.quiz.length} kurzen Fragen.</p></div><Link className="button button-primary" to={`/lektionen/${lesson.id}/quiz`}>Quiz starten <ArrowRight size={17} /></Link></section></div>
}
