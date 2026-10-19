import type { PlanWeek } from './plan'

export interface AiPrompt {
  id: string
  title: string
  when: string
  text: string
}

const MISTAKES_PLACEHOLDER = '[write your 3 most frequent mistakes here]'

/**
 * Builds the four AI prompts for a week, injecting the learner's recurring mistakes when available.
 *
 * @param {PlanWeek} week Week whose grammar focus and topic are used.
 * @param {string[]} mistakes Recurring mistakes noted in the previous weekly review.
 * @returns {AiPrompt[]} Ready-to-copy prompts.
 */
export function buildPrompts(week: PlanWeek, mistakes: string[] = []): AiPrompt[] {
  const cleaned = mistakes.map(m => m.trim()).filter(Boolean)
  const mistakeLine = cleaned.length ? cleaned.map(m => `"${m}"`).join('; ') : MISTAKES_PLACEHOLDER

  return [
    {
      id: 'speaking',
      title: '1 · Preguntas para speaking',
      when: 'Lunes (reto con IA) y semanas 3 y 7. Responde por voz si tu app lo permite.',
      text: `Act as a friendly English conversation partner for an A2–B1 learner whose first language is Spanish.
Ask me one short question at a time about ${week.topicEn}. Every question should make me use: ${week.focus}.
Do not correct me during the conversation. Just reply naturally in 1–2 sentences and ask the next question.
My most frequent mistakes last week were: ${mistakeLine}. Ask questions that make me practise them too.
When I write "END", give me:
1. My 3 most important mistakes (original → corrected → why, in Spanish, max 15 words).
2. 3 natural phrases I could have used.`,
    },
    {
      id: 'errors',
      title: '2 · Texto con errores controlados',
      when: 'Miércoles, Correcting and learning.',
      text: `Write a paragraph of 6 sentences at A2–B1 level about ${week.topicEn}.
Include exactly 5 mistakes, and ONLY in this grammar point: ${week.focus}. Everything else must be correct.
Do not mark the mistakes and do not show the correct version yet.
When I send you my corrections, show the correct paragraph and explain each mistake in one line in Spanish.
If I marked something as a mistake that was correct, tell me.`,
    },
    {
      id: 'grammar',
      title: '3 · Corrección solo gramatical',
      when: 'Viernes, paso 4a de MetaWriting.',
      text: `I am an A2–B1 English learner (first language: Spanish). This week I am practising: ${week.focus}.
Correct ONLY the grammar of my text. Do not change vocabulary or style unless it is wrong.
Format: a table with columns Original | Corrected | Rule (in Spanish, max 12 words).
After the table, tell me my 3 most repeated types of mistakes, ordered by how much they affect understanding.

My text:
[paste your text]`,
    },
    {
      id: 'style',
      title: '4 · Naturalidad y estilo',
      when: 'Viernes paso 4b, y lunes para corregir la transcripción de tu grabación.',
      text: `Now look at the same text for naturalness, not grammar.
Find 3–5 parts that sound like a direct translation from Spanish.
For each one show: what I wrote → a more natural version → the Spanish idea I was probably translating.
Keep the new versions at B1 level. Do not rewrite the whole text.
If this is a transcription of me speaking, ignore punctuation, "um" and repeated words.`,
    },
  ]
}
