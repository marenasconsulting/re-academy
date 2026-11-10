export interface Category { id: string; title: string; description: string; icon: string; label: string; color: string }
export interface Section { id: string; heading: string; paragraphs: string[] }
export interface Question { id: string; prompt: string; options: { id: string; text: string }[]; correctAnswerId: string; explanation: string }
export interface Source { id: string; title: string; fileName: string }
export interface SourceReference { documentId: string; locator: string }
interface LessonBase { id: string; categoryId: string; title: string; duration: number; introduction: string }
interface ReadingContent extends LessonBase { status: 'available'; sections: Section[]; example: { title: string; text: string }; takeaway: string; sources: SourceReference[] }
export interface AvailableLesson extends ReadingContent { format: 'lesson'; quiz: Question[] }
export interface KnowledgeArticle extends ReadingContent { format: 'knowledge'; quiz?: never }
export interface PlannedLesson extends LessonBase { status: 'planned' }
export type Lesson = AvailableLesson | KnowledgeArticle | PlannedLesson
