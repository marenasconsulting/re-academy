import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import type { Category, Lesson } from '../src/content/types'
const categories: Category[] = JSON.parse(readFileSync(new URL('../src/content/categories.json', import.meta.url), 'utf8'))
const lessons: Lesson[] = JSON.parse(readFileSync(new URL('../src/content/lessons.json', import.meta.url), 'utf8'))

test('Inhalte haben eindeutige IDs und gültige Quizantworten', () => {
 expect(categories).toHaveLength(4)
 expect(lessons.filter(l => l.status === 'available')).toHaveLength(2)
 const ids = new Set<string>()
 const check = (id: string) => { expect(ids.has(id)).toBe(false); ids.add(id) }
 for (const c of categories) check(c.id)
 for (const l of lessons) {
  check(l.id)
  expect(categories.some(c => c.id === l.categoryId)).toBe(true)
  if (l.status !== 'available') continue
  expect(l.quiz).toHaveLength(5)
  expect(l.sections.length).toBeGreaterThan(0)
  expect(l.example.text.length).toBeGreaterThan(0)
  for (const section of l.sections) check(`${l.id}/${section.id}`)
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

for (const lesson of lessons.filter(l => l.status === 'available')) {
 test(`${lesson.title}: lesen, Quiz, Rückmeldung, Ergebnis und Wiederholung`, async ({ page }) => {
  await page.goto('/')
  const category = categories.find(c => c.id === lesson.categoryId)!
  await page.getByRole('link', { name: `${category.title}: Bereich öffnen`, exact: true }).click()
  await page.getByRole('link', { name: 'Lektion öffnen' }).click()
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
   await page.getByRole('button', { name: i === 4 ? 'Ergebnis ansehen' : 'Nächste Frage' }).click()
  }
  await expect(page.locator('.quiz-result')).toContainText('4 von 5 Fragen')
  await expect(page.locator('.answer-review article')).toHaveCount(5)
  await page.getByRole('button', { name: 'Quiz wiederholen' }).click()
  await expect(page.locator('.quiz-topline')).toContainText('FRAGE 1 VON 5')
  await expect(page.locator('.answer-option:enabled')).toHaveCount(3)
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
 for (const route of ['/', '/kategorien/requirements-engineering', '/lektionen/re-einfuehrung', '/lektionen/api-grundlagen/quiz']) {
  await page.goto(route)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
 }
})

test('Quiz lässt sich vollständig per Tastatur bedienen', async ({ page }) => {
 const api = lessons.find(l => l.id === 'api-grundlagen')!
 if (api.status !== 'available') throw new Error('API-Lektion fehlt')
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
