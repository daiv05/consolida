import type { ResourceKey } from './resources'
import { addDays, startOfWeek } from './dates'

export interface PlanWeek {
  number: number
  focus: string
  topic: string
  topicEn: string
  segments: string
  grammar: ResourceKey[]
  monday: { resource: ResourceKey, tip: string }
  speaking: string
  wednesday: { resource: ResourceKey, tip: string }
  easyInput: string
  writing: string
  anki: string
  conversation: boolean
  checkpoint?: string
}

export interface PlanTask {
  key: string
  week: number
  day: number
  title: string
  minutes: number
  detail: string
  links: ResourceKey[]
  optional: boolean
}

export const PLAN_LENGTH_WEEKS = 8

export const WEEKS: PlanWeek[] = [
  {
    number: 1,
    focus: 'Past simple',
    topic: 'tu último fin de semana o un viaje',
    topicEn: 'your last weekend or a trip you took',
    segments: '2–4 s, recrea después de cada segmento',
    grammar: ['pegPast'],
    monday: { resource: 'easyStories', tip: 'Elige una historia de nivel pre-intermedio. Las historias se cuentan en pasado: ideal para esta semana.' },
    speaking: 'Cuenta en 1:30 min qué hiciste ayer desde que te levantaste. Mínimo 10 verbos en pasado, 5 de ellos irregulares.',
    wednesday: { resource: 'esllabEasy', tip: 'Clip corto de nivel fácil. En la ronda 2 anota solo los verbos en pasado.' },
    easyInput: 'Extr@ English, episodios 1–2',
    writing: 'Write about the best trip you remember: where you went, who you were with and what happened.',
    anki: 'Verbos irregulares que fallaste, dentro de una frase.',
    conversation: false,
  },
  {
    number: 2,
    focus: 'Past continuous + past simple',
    topic: 'una historia con una interrupción (when / while)',
    topicEn: 'a story where something interrupted you',
    segments: '2–4 s, recrea después de cada segmento',
    grammar: ['pegPastCont'],
    monday: { resource: 'easyStories', tip: 'Otra historia. Mientras escuchas, caza cada “was/were + -ing”.' },
    speaking: 'Cuenta una anécdota real que empiece con “I was … when …”. Hazlo 3 veces cambiando la anécdota.',
    wednesday: { resource: 'esllabEasy', tip: 'Busca un diálogo donde alguien narre algo que pasó.' },
    easyInput: 'Extr@ English, episodios 3–4',
    writing: 'Write a short story that begins: “It was raining and I was walking home when…”',
    anki: 'Frases con when / while que te hayan costado.',
    conversation: false,
  },
  {
    number: 3,
    focus: 'Present perfect vs past simple',
    topic: 'experiencias de vida (ever, never, already, yet, for, since)',
    topicEn: 'life experiences',
    segments: '2–4 s, recrea después de cada segmento',
    grammar: ['pegPP', 'pegPPvsPS'],
    monday: { resource: 'realEasy', tip: 'Conversaciones de personas reales a velocidad lenta, con transcripción.' },
    speaking: 'Usa el prompt 1 de la IA: te hará preguntas “Have you ever…?”. Responde con present perfect y da el detalle en past simple. 5 min.',
    wednesday: { resource: 'elllo', tip: 'Filtra por nivel pre-intermedio y elige una entrevista corta.' },
    easyInput: 'Extr@ English, episodios 5–6',
    writing: 'Write about three things you have never done and one thing you did for the first time last year.',
    anki: 'Pares de frases: “I have been to…” / “I went there in…”.',
    conversation: false,
  },
  {
    number: 4,
    focus: 'Futuro: going to, will, present continuous',
    topic: 'tus planes para las próximas semanas',
    topicEn: 'your plans for the next few weeks',
    segments: '2–4 s, recrea después de cada segmento',
    grammar: ['pegFuture'],
    monday: { resource: 'voaL2', tip: 'Video corto con transcripción. Elige una lección donde los personajes hablen de planes.' },
    speaking: 'Describe tus planes en 2 min: going to para planes, will para decisiones y predicciones, present continuous para citas con fecha.',
    wednesday: { resource: 'nil2', tip: 'Noticia con audio de nivel 2. Anota los verbos en futuro.' },
    easyInput: 'Extr@ English, episodios 7–8',
    writing: 'Write an email to a friend about your plans for the next holidays. Invite them to do something with you.',
    anki: 'Una frase por cada forma de futuro.',
    conversation: false,
    checkpoint: 'Grábate 2 min con la consigna “Tell me about yourself: your past, your present and your future plans”. Guarda el audio y la transcripción, y registra tu nivel de Write & Improve en el diario.',
  },
  {
    number: 5,
    focus: 'Comparatives y superlatives',
    topic: 'comparar lugares, trabajos y tecnología',
    topicEn: 'comparing cities, jobs and technology',
    segments: '3–6 s, recrea cada 2 segmentos',
    grammar: ['pegComp'],
    monday: { resource: 'easyEnglish', tip: 'Entrevistas en la calle con subtítulos. Primer audio a velocidad real: si entiendes menos del 80 %, vuelve a Real Easy English.' },
    speaking: 'Compara tu ciudad con otra que conozcas: 10 comparaciones en 1:30 min. Incluye “as … as” y “not as … as”.',
    wednesday: { resource: 'bne', tip: 'Elige una noticia de nivel 2 o 3, con audio lento.' },
    easyInput: 'Extr@ English, episodios 9–10',
    writing: 'Which is better: living in a big city or in a small town? Give at least three reasons.',
    anki: 'Comparativos irregulares (better, worse, further) en frases.',
    conversation: true,
  },
  {
    number: 6,
    focus: 'Obligación y consejo: have to, must, should',
    topic: 'trabajo, estudio y salud',
    topicEn: 'work, study and health',
    segments: '3–6 s, recrea cada 2 segmentos',
    grammar: ['pegModal'],
    monday: { resource: 'sixMin', tip: 'Primer audio B1 real. Usa la transcripción de la página del episodio.' },
    speaking: 'Da 5 consejos a alguien que empieza a aprender inglés (should) y explica 5 reglas de tu trabajo o estudio (have to / don’t have to / must).',
    wednesday: { resource: 'esllabInt', tip: 'Primer clip de nivel intermedio.' },
    easyInput: 'Extr@ English, episodios 11–12',
    writing: 'Write advice for a new person starting at your job or school: what they have to do, what they should do and what they don’t have to worry about.',
    anki: 'Diferencia entre “mustn’t” y “don’t have to”, con ejemplos tuyos.',
    conversation: true,
  },
  {
    number: 7,
    focus: 'First y second conditional',
    topic: 'situaciones reales e hipotéticas',
    topicEn: 'real and imaginary situations',
    segments: '3–6 s, recrea cada 2 segmentos',
    grammar: ['pegFirst', 'pegSecond', 'bcCond'],
    monday: { resource: 'sixMin', tip: 'Busca un episodio sobre un tema que te interese; los episodios de opinión usan muchos condicionales.' },
    speaking: 'Usa el prompt 1 con preguntas “What would you do if…?” durante 5 min. Luego 1:30 min de “If I …, I will …” sobre la próxima semana.',
    wednesday: { resource: 'nil3', tip: 'Noticia de nivel 3: un poco más rápida.' },
    easyInput: 'Extr@ English, episodios 13–14',
    writing: 'If you could live anywhere in the world for one year, where would you live and why? What would you do there?',
    anki: 'Una frase first y otra second conditional sobre tu vida.',
    conversation: true,
  },
  {
    number: 8,
    focus: 'Used to + repaso general',
    topic: 'antes y ahora',
    topicEn: 'how life was in the past and how it is now',
    segments: '3–6 s, recrea cada 2 segmentos',
    grammar: ['pegUsed'],
    monday: { resource: 'lr', tip: 'Reto final del plan original: una escena de una serie que te guste, con Language Reactor para pausar frase por frase.' },
    speaking: 'Responde en 2 min: “How was your life different ten years ago?”. Usa used to y al menos 3 estructuras de semanas anteriores.',
    wednesday: { resource: 'easyEnglish', tip: 'Entrevista sobre cómo cambió algo (ciudad, trabajo, costumbres).' },
    easyInput: 'Extr@ English, episodios 15–16',
    writing: 'Write about how your life has changed: what you used to do, what you do now and what you are going to do next.',
    anki: 'Repasa todo el mazo y suspende las tarjetas que ya son fáciles.',
    conversation: true,
    checkpoint: 'Repite la grabación de la semana 4 con la misma consigna. Compara las dos transcripciones: errores de verbo, pausas largas y estructuras distintas. Compara también tu nivel de Write & Improve.',
  },
]

/**
 * Builds the ordered list of tasks for one week of the plan.
 *
 * @param {PlanWeek} week Week definition.
 * @returns {PlanTask[]} Tasks from Monday to Sunday.
 */
export function buildWeekTasks(week: PlanWeek): PlanTask[] {
  const n = week.number
  const t = (day: number, slug: string, title: string, minutes: number, detail: string, links: ResourceKey[], optional = false): PlanTask =>
    ({ key: `w${n}.d${day}.${slug}`, week: n, day, title, minutes, detail, links, optional })

  const tasks: PlanTask[] = [
    t(0, 'listen', 'Active listening + recreación', 15, `${week.monday.tip} Segmentos de ${week.segments}. Al final compara con la transcripción.`, [week.monday.resource]),
    t(0, 'speak', 'Speaking con retos', 15, `${week.speaking} Grábate, transcribe con dictado y corrige con el prompt 4.`, ['dictation']),
    t(0, 'anki', '5 frases a Anki', 5, `${week.anki} Regístralas también en Frases.`, ['anki']),
    t(1, 'anki', 'Repaso en Anki', 7, 'Solo las tarjetas pendientes del día.', ['anki']),
    t(1, 'input', 'Entrada fácil sin pausar', 13, `${week.easyInput}. Mira sin detenerte, con subtítulos en inglés. Es para disfrutar.`, ['extra']),
    t(2, 'notes', 'Active listening + anotar palabras', 15, `${week.wednesday.tip} Cinco rondas de 30–60 s: contexto, verbos, otras palabras, búsqueda y subtítulos.`, [week.wednesday.resource]),
    t(2, 'correct', 'Correcting and learning', 15, `Usa el prompt 2 (errores solo en “${week.focus}”) o corrige tu texto del viernes anterior. Paso 3: reformula en voz alta sin mirar.`, week.grammar),
    t(3, 'anki', 'Repaso en Anki', 7, 'Solo las tarjetas pendientes del día.', ['anki']),
    t(3, 'read', 'Noticia graduada', 8, 'Lee y escucha una noticia del nivel que estés usando.', [n <= 4 ? 'nil2' : 'nil3']),
    t(3, 'pron', 'Pronunciación', 5, 'Busca en YouGlish 3 palabras que pronunciaste mal el lunes y repítelas con 3 hablantes distintos.', ['youglish']),
    t(4, 'write', 'MetaWriting', 20, `Tema: “${week.writing}” Planifica 5 min, escribe 5 min sin borrar, autocorrige 5 min con otro color (verbos, preposiciones, orden) y analiza 5 min con los prompts 3 y 4.`, week.grammar),
    t(4, 'wai', 'Feedback de Cambridge', 10, 'Pega el texto corregido en Write & Improve y registra el nivel CEFR en el diario de la semana.', ['wai']),
    t(5, 'series', 'Serie por gusto', 20, 'Cualquier serie con Language Reactor. Si te apetece, guarda una frase para Anki.', ['lr'], true),
  ]
  if (week.conversation) {
    tasks.push(t(5, 'talk', 'Conversación real', 20, `15–20 min con una persona sobre “${week.topic}”.`, ['tandem', 'hellotalk', 'italki'], true))
  }
  tasks.push(t(6, 'review', 'Revisión semanal', 10, 'Escucha tu grabación del lunes y anota en el diario tus 3 errores más repetidos: los prompts de la semana siguiente los usarán.', []))
  return tasks
}

export const ALL_TASKS: PlanTask[] = WEEKS.flatMap(buildWeekTasks)

export const TASKS_BY_KEY: ReadonlyMap<string, PlanTask> = new Map(ALL_TASKS.map(task => [task.key, task]))

export const REQUIRED_TASKS: PlanTask[] = ALL_TASKS.filter(task => !task.optional)

/**
 * Returns the calendar date on which a task is scheduled.
 *
 * @param {string} startDate Monday the plan starts, YYYY-MM-DD.
 * @param {PlanTask} task Task to place.
 * @returns {string} Scheduled date in YYYY-MM-DD format.
 */
export function taskDate(startDate: string, task: Pick<PlanTask, 'week' | 'day'>): string {
  return addDays(startDate, (task.week - 1) * 7 + task.day)
}

/**
 * Normalises any chosen start date to the Monday of its week.
 *
 * @param {string} date Desired start date, YYYY-MM-DD.
 * @returns {string} The Monday on or before the date.
 */
export function normaliseStartDate(date: string): string {
  return startOfWeek(date)
}
