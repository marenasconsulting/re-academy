import categoryData from './categories.json'
import lessonData from './lessons.json'
import knowledgeData from './knowledge.json'
import sourceData from './sources.json'
import type { AvailableLesson, Category, KnowledgeArticle, Lesson, Source } from './types'
export const categories: Category[] = categoryData
export const sources: Source[] = sourceData
export const lessons = [...lessonData, ...knowledgeData] as Lesson[]
export const availableLessons = lessons.filter((lesson): lesson is AvailableLesson => lesson.status === 'available' && lesson.format === 'lesson')
export const availableKnowledge = lessons.filter((lesson): lesson is KnowledgeArticle => lesson.status === 'available' && lesson.format === 'knowledge')
