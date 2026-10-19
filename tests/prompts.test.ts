import { describe, expect, it } from 'vitest'
import { WEEKS } from '../shared/utils/plan'
import { buildPrompts } from '../shared/utils/prompts'

const PLACEHOLDER = '[write your 3 most frequent mistakes here]'
const week = WEEKS[0]!

describe('buildPrompts', () => {
  it('returns four prompts in order', () => {
    const prompts = buildPrompts(week)
    expect(prompts).toHaveLength(4)
    expect(prompts.map(p => p.id)).toEqual(['speaking', 'errors', 'grammar', 'style'])
  })

  it('gives every prompt a title, schedule and text', () => {
    for (const prompt of buildPrompts(week)) {
      expect(prompt.title).toBeTruthy()
      expect(prompt.when).toBeTruthy()
      expect(prompt.text).toBeTruthy()
    }
  })

  it('injects the week focus and topic where relevant', () => {
    const [speaking, errors, grammar, style] = buildPrompts(week)
    expect(speaking!.text).toContain(week.focus)
    expect(speaking!.text).toContain(week.topicEn)
    expect(errors!.text).toContain(week.focus)
    expect(errors!.text).toContain(week.topicEn)
    expect(grammar!.text).toContain(week.focus)
    expect(style!.text).not.toContain(week.focus)
  })

  it('adapts to a different week', () => {
    const other = WEEKS[4]!
    const speaking = buildPrompts(other)[0]!
    expect(speaking.text).toContain(other.focus)
    expect(speaking.text).toContain(other.topicEn)
    expect(speaking.text).not.toContain(week.focus)
  })

  it('uses the placeholder when there are no mistakes', () => {
    expect(buildPrompts(week)[0]!.text).toContain(PLACEHOLDER)
    expect(buildPrompts(week, [])[0]!.text).toContain(PLACEHOLDER)
  })

  it('uses the placeholder when all mistakes are blank', () => {
    expect(buildPrompts(week, ['', '   '])[0]!.text).toContain(PLACEHOLDER)
  })

  it('quotes the mistakes and drops the placeholder', () => {
    const text = buildPrompts(week, ['I goed', 'she go'])[0]!.text
    expect(text).toContain('"I goed"; "she go"')
    expect(text).not.toContain(PLACEHOLDER)
  })

  it('ignores blank entries and trims the others', () => {
    const text = buildPrompts(week, ['  I goed  ', '', '   ', 'he have'])[0]!.text
    expect(text).toContain('"I goed"; "he have"')
    expect(text).not.toContain('""')
  })
})
