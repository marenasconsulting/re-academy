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
  const categoryLessons = lessons.filter(l => l.categoryId === category.id)
  return <><Link className="back-link" to="/"><ArrowLeft size={16} /> Alle Lernbereiche</Link><div className={`category-page-heading ${category.color}`}><span className="category-icon"><Icon name={category.icon} size={30} /></span><p className="eyebrow">{category.label}</p><h1>{category.title}</h1><p>{category.description}</p><span className="duration">{categoryLessons.filter(l => l.status === 'available').length} von {categoryLessons.length} Lektionen verfügbar</span></div><div className="section-heading"><h2>Deine Lektionen</h2><span>Beginne mit dem ersten Schritt.</span></div><div className="lesson-list">{categoryLessons.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} index={index} />)}</div></>
}
