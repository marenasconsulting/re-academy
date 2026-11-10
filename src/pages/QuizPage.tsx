import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { lessons } from '../content'
import { Quiz } from '../components/Quiz'
import { NotFound } from './NotFound'
export function QuizPage() {
 const { lessonId } = useParams()
 const lesson = lessons.find(l => l.id === lessonId)
 if (!lesson) return <NotFound />
 if (lesson.status !== 'available') return <NotFound planned />
 if (lesson.format === 'knowledge') return <Navigate replace to={`/lektionen/${lesson.id}`} />
 if (!lesson.quiz.length) return <NotFound />
 return <div className="quiz-layout"><Link className="back-link" to={`/lektionen/${lesson.id}`}><ArrowLeft size={16} /> Zur Lektion</Link><p className="eyebrow">TESTE DEIN WISSEN</p><h1 className="quiz-title">{lesson.title}</h1><Quiz key={lesson.id} lesson={lesson} /></div>
}
