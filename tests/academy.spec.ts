import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import type { AvailableLesson, Category, KnowledgeArticle, Lesson, Source } from '../src/content/types'
const categories: Category[] = JSON.parse(readFileSync(new URL('../src/content/categories.json', import.meta.url), 'utf8'))
const readContent = (name: string) => JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), 'utf8'))
const knowledge: KnowledgeArticle[] = readContent('knowledge')
const lessons: Lesson[] = [...readContent('lessons'), ...knowledge]
const sources: Source[] = readContent('sources')
const playable = lessons.filter((l): l is AvailableLesson => l.status === 'available' && l.format === 'lesson')

test('Inhalte haben eindeutige IDs und gültige Quizantworten', () => {
 expect(categories).toHaveLength(4)
 expect(playable).toHaveLength(16)
 expect(knowledge).toHaveLength(19)
 expect(sources).toHaveLength(4)
 const ids = new Set<string>()
 const check = (id: string) => { expect(ids.has(id)).toBe(false); ids.add(id) }
 for (const c of categories) check(c.id)
 for (const l of lessons) {
  check(l.id)
  expect(categories.some(c => c.id === l.categoryId)).toBe(true)
  if (l.status !== 'available') continue
  expect(l.sections.length).toBeGreaterThan(0)
  expect(l.example.text.length).toBeGreaterThan(0)
  for (const section of l.sections) check(`${l.id}/${section.id}`)
  expect(l.sources.length).toBeGreaterThan(0)
  for (const source of l.sources) {
   expect(sources.some(s => s.id === source.documentId)).toBe(true)
   expect(source.locator.length).toBeGreaterThan(0)
  }
  if (l.format === 'knowledge') {
   expect(l).not.toHaveProperty('quiz')
   continue
  }
  expect(l.quiz.length).toBeGreaterThanOrEqual(3)
  expect(l.quiz.length).toBeLessThanOrEqual(5)
  for (const q of l.quiz) {
   check(q.id)
   expect(q.options.filter(o => o.id === q.correctAnswerId)).toHaveLength(1)
   expect(q.explanation.length).toBeGreaterThan(0)
   for (const o of q.options) check(o.id)
  }
 }
})

test('Dashboard und alle Kategorieübersichten', async ({ page }) => {
 await page.goto('/')
 await expect(page.getByRole('heading', { level: 1 })).toContainText('Wissen, das weiterbringt')
 await expect(page.locator('.category-card')).toHaveCount(4)
 for (const c of categories) {
  await page.getByRole('link', { name: `${c.title}: Bereich öffnen`, exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(c.title)
  for (const l of lessons.filter(l => l.categoryId === c.id)) {
   const card = page.locator('.lesson-card').filter({ has: page.getByRole('heading', { name: l.title, exact: true }) })
   await expect(card).toBeVisible()
   if (l.status === 'planned') { await expect(card).toContainText('Demnächst verfügbar'); await expect(card.getByRole('link')).toHaveCount(0) }
  }
  await page.getByRole('link', { name: 'Alle Lernbereiche' }).click()
 }
})

for (const lesson of playable) {
 test(`${lesson.title}: lesen, Quiz, Rückmeldung, Ergebnis und Wiederholung`, async ({ page }) => {
  await page.goto('/')
  const category = categories.find(c => c.id === lesson.categoryId)!
  await page.getByRole('link', { name: `${category.title}: Bereich öffnen`, exact: true }).click()
  await page.locator('.lesson-card').filter({ has: page.getByRole('heading', { name: lesson.title, exact: true }) }).getByRole('link', { name: 'Lektion öffnen' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(lesson.title)
  await expect(page.getByRole('heading', { name: lesson.example.title })).toBeVisible()
  await page.getByRole('link', { name: 'Quiz starten' }).click()
  for (const [i, q] of lesson.quiz.entries()) {
   // Eine falsche Antwort prüft die Bewertung und ihre Erklärung.
   const option = i === 0 ? q.options.find(o => o.id !== q.correctAnswerId)! : q.options.find(o => o.id === q.correctAnswerId)!
   await page.getByRole('button', { name: option.text, exact: false }).click()
   await expect(page.locator('.feedback')).toContainText(q.explanation)
   await expect(page.locator('.answer-option:enabled')).toHaveCount(0)
   await expect(page.getByRole('progressbar')).toHaveAttribute('value', String(i + 1))
   await page.getByRole('button', { name: i === lesson.quiz.length - 1 ? 'Ergebnis ansehen' : 'Nächste Frage' }).click()
  }
  await expect(page.locator('.quiz-result')).toContainText(`${lesson.quiz.length - 1} von ${lesson.quiz.length} Fragen`)
  await expect(page.locator('.answer-review article')).toHaveCount(lesson.quiz.length)
  await page.getByRole('button', { name: 'Quiz wiederholen' }).click()
  await expect(page.locator('.quiz-topline')).toContainText(`FRAGE 1 VON ${lesson.quiz.length}`)
  await expect(page.locator('.answer-option:enabled')).toHaveCount(lesson.quiz[0].options.length)
  await expect(page.getByRole('progressbar')).toHaveAttribute('value', '0')
 })
}

test('Fehlende und geplante Inhalte werden abgefangen', async ({ page }) => {
 for (const route of ['/unbekannt', '/kategorien/fehlt', '/lektionen/fehlt', '/lektionen/fehlt/quiz']) {
  await page.goto(route)
  await expect(page.getByRole('heading', { name: 'Seite nicht gefunden.' })).toBeVisible()
 }
 for (const route of ['/lektionen/datenbanken', '/lektionen/datenbanken/quiz']) {
  await page.goto(route)
  await expect(page.getByRole('heading', { name: 'Diese Lektion entsteht gerade.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Quiz starten' })).toHaveCount(0)
 }
})

test('Kein horizontales Überlaufen auf den zentralen Seiten', async ({ page }) => {
 for (const route of ['/', '/kategorien/requirements-engineering', '/lektionen/re-einfuehrung', '/lektionen/api-grundlagen/quiz', '/kategorien/re-praxis#tools-methoden', '/lektionen/uml-use-cases', '/lektionen/roadmap-item-prozess']) {
  await page.goto(route)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
 }
})

test('Quiz lässt sich vollständig per Tastatur bedienen', async ({ page }) => {
 const api = lessons.find(l => l.id === 'api-grundlagen')!
 if (api.status !== 'available' || api.format !== 'lesson') throw new Error('API-Lektion fehlt')
 await page.goto('/lektionen/api-grundlagen/quiz')
 for (const q of api.quiz) {
  await page.locator('.question-card h2').focus()
  await page.keyboard.press('Tab')
  const optionIndex = q.options.findIndex(o => o.id === q.correctAnswerId)
  for (let i = 0; i < optionIndex; i++) await page.keyboard.press('Tab')
  await expect(page.locator('.answer-option').nth(optionIndex)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('.feedback')).toContainText('Richtig beantwortet!')
  await page.keyboard.press('Tab')
  await expect(page.locator('.question-actions button')).toBeFocused()
  await page.keyboard.press('Enter')
 }
 await expect(page.locator('.quiz-result')).toContainText('5 von 5 Fragen')
})


test('Alle Wissensartikel sind lesbar und haben weder Quiz noch Quizroute', async ({ page }) => {
 await page.goto('/kategorien/re-praxis')
 const section = page.getByRole('region', { name: 'Tools & Methoden', exact: true })
 await expect(section.locator('.lesson-card')).toHaveCount(19)
 for (const article of knowledge) {
  const card = section.locator('.lesson-card').filter({ has: page.getByRole('heading', { name: article.title, exact: true }) })
  await expect(card).toContainText('Ohne Quiz')
  await card.getByRole('link', { name: 'Wissen öffnen' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(article.title)
  await expect(page.locator('.lesson-meta')).toContainText('Wissen ohne Quiz')
  await expect(page.getByRole('link', { name: 'Quiz starten' })).toHaveCount(0)
  await expect(page.getByRole('complementary', { name: 'Quellen' })).toContainText(article.sources[0].locator)
  await page.goto(`/lektionen/${article.id}/quiz`)
  await expect(page).toHaveURL(`/lektionen/${article.id}`)
  await expect(page.getByRole('progressbar')).toHaveCount(0)
  await page.getByRole('link', { name: 'Weitere Themen' }).click()
  await expect(page).toHaveURL('/kategorien/re-praxis#tools-methoden')
 }
})

test('Dashboard zählt Wissen und Lektionen separat und verlinkt den Wissensbereich', async ({ page }) => {
 await page.goto('/')
 await expect(page.locator('.facts')).toContainText('16')
 const practice = page.locator('.category-card').filter({ has: page.getByRole('heading', { name: 'RE-Praxiswissen', exact: true }) })
 await expect(practice).toContainText('2 Lektionen verfügbar')
 await expect(practice).toContainText('19 Wissensartikel')
 await practice.getByRole('link').click()
 await page.getByRole('link', { name: 'Zu Tools & Methoden' }).click()
 await expect(page).toHaveURL('/kategorien/re-praxis#tools-methoden')
})
