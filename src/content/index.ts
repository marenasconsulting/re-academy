import categoryData from './categories.json'
import lessonData from './lessons.json'
import type { Category, Lesson } from './types'
export const categories: Category[] = categoryData
export const lessons = lessonData as Lesson[]
export const availableLessons = lessons.filter(lesson => lesson.status === 'available')
