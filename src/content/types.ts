export interface Category { id: string; title: string; description: string; icon: string; label: string; color: string }
export interface Section { id: string; heading: string; paragraphs: string[] }
export interface Question { id: string; prompt: string; options: { id: string; text: string }[]; correctAnswerId: string; explanation: string }
interface LessonBase { id: string; categoryId: string; title: string; duration: number; introduction: string }
export interface AvailableLesson extends LessonBase { status: 'available'; sections: Section[]; example: { title: string; text: string }; takeaway: string; quiz: Question[] }
export interface PlannedLesson extends LessonBase { status: 'planned' }
export type Lesson = AvailableLesson | PlannedLesson
