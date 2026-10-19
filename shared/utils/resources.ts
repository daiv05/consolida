export interface Resource {
  name: string
  url: string
  level: string
  description: string
  category: ResourceCategory
}

export type ResourceCategory = 'listening' | 'reading' | 'output' | 'tools'

export const RESOURCE_CATEGORIES: Record<ResourceCategory, string> = {
  listening: 'Escuchar',
  reading: 'Leer y gramática',
  output: 'Escribir y hablar',
  tools: 'Pronunciación y herramientas',
}

export const RESOURCES = {
  voaL2: { name: 'VOA Let’s Learn English · Level 2', url: 'https://learningenglish.voanews.com/p/6765.html', level: 'A2', category: 'listening', description: 'Videos cortos con transcripción y ejercicios. El mejor punto de partida.' },
  easyStories: { name: 'Easy Stories in English', url: 'https://easystoriesinenglish.com/', level: 'A2–B1', category: 'listening', description: 'Historias narradas despacio, en pasado. Perfecto para las semanas 1 y 2.' },
  extra: { name: 'Extr@ English, 30 episodios', url: 'https://www.youtube.com/playlist?list=PLiSXvPiNzG5L-xuQETbubWE4Ejabr2l3X', level: 'A2', category: 'listening', description: 'Comedia hecha para estudiantes. Ideal para los días de descanso activo.' },
  elllo: { name: 'ELLLO por niveles', url: 'https://www.elllo.org/levels/', level: 'A1–B2', category: 'listening', description: 'Miles de audios cortos de hablantes de muchos países, filtrados por nivel.' },
  esllabEasy: { name: 'ESL-Lab · Easy', url: 'https://www.esl-lab.com/easy/', level: 'A2', category: 'listening', description: 'Diálogos de 1–2 min con preguntas. Bueno para las 5 rondas del miércoles.' },
  esllabInt: { name: 'ESL-Lab · Intermediate', url: 'https://www.esl-lab.com/intermediate/', level: 'B1', category: 'listening', description: 'El siguiente paso después de Easy, con el mismo formato.' },
  realEasy: { name: 'BBC Real Easy English', url: 'https://www.bbc.co.uk/learningenglish/english/features/real-easy-english', level: 'A2–B1', category: 'listening', description: 'Conversaciones reales y lentas de la BBC, con transcripción.' },
  sixMin: { name: 'BBC 6 Minute English', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', level: 'B1', category: 'listening', description: 'El estándar para B1. Cada episodio trae transcripción y vocabulario.' },
  tews: { name: 'BBC The English We Speak', url: 'https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak', level: 'B1', category: 'listening', description: 'Expresiones coloquiales en 3 minutos.' },
  easyEnglish: { name: 'Easy English (YouTube)', url: 'https://www.youtube.com/@EasyEnglishVideos', level: 'B1', category: 'listening', description: 'Entrevistas en la calle con subtítulos dobles. Velocidad real.' },
  nil2: { name: 'News in Levels · nivel 2', url: 'https://www.newsinlevels.com/level/level-2/', level: 'A2', category: 'reading', description: 'Noticias reescritas por nivel, con audio.' },
  nil3: { name: 'News in Levels · nivel 3', url: 'https://www.newsinlevels.com/level/level-3/', level: 'B1', category: 'reading', description: 'La misma idea, un poco más rápido y con más vocabulario.' },
  bne: { name: 'Breaking News English', url: 'https://breakingnewsenglish.com/', level: 'A2–B1', category: 'reading', description: 'La misma noticia en 7 niveles, con audio a varias velocidades.' },
  peg: { name: 'Perfect English Grammar', url: 'https://www.perfect-english-grammar.com/grammar-explanations.html', level: 'A2–B2', category: 'reading', description: 'Explicaciones claras y ejercicios con solución. Úsalo para verificar a la IA.' },
  bcGram: { name: 'British Council · gramática A1–A2', url: 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar', level: 'A1–A2', category: 'reading', description: 'Explicaciones del British Council con ejercicios interactivos.' },
  bbcLowInt: { name: 'BBC curso Lower intermediate', url: 'https://www.bbc.co.uk/learningenglish/english/course/lower-intermediate', level: 'A2–B1', category: 'reading', description: 'Curso completo de la BBC si quieres una base ordenada.' },
  pegPast: { name: 'Past simple', url: 'https://www.perfect-english-grammar.com/past-simple.html', level: 'A2', category: 'reading', description: 'Explicación y ejercicios.' },
  pegPastCont: { name: 'Past continuous', url: 'https://www.perfect-english-grammar.com/past-continuous.html', level: 'A2', category: 'reading', description: 'Explicación y ejercicios.' },
  pegPP: { name: 'Present perfect', url: 'https://www.perfect-english-grammar.com/present-perfect.html', level: 'A2–B1', category: 'reading', description: 'Explicación y ejercicios.' },
  pegPPvsPS: { name: 'Present perfect o past simple', url: 'https://www.perfect-english-grammar.com/present-perfect-or-past-simple.html', level: 'B1', category: 'reading', description: 'Explicación y ejercicios.' },
  pegFuture: { name: 'Will o be going to', url: 'https://www.perfect-english-grammar.com/will-or-be-going-to.html', level: 'A2–B1', category: 'reading', description: 'Explicación y ejercicios.' },
  pegComp: { name: 'Comparatives y superlatives', url: 'https://www.perfect-english-grammar.com/adjectives-comparative-and-superlative.html', level: 'A2', category: 'reading', description: 'Explicación y ejercicios.' },
  pegModal: { name: 'Modales de obligación', url: 'https://www.perfect-english-grammar.com/modal-verbs-of-obligation.html', level: 'B1', category: 'reading', description: 'Explicación y ejercicios.' },
  pegFirst: { name: 'First conditional', url: 'https://www.perfect-english-grammar.com/first-conditional.html', level: 'B1', category: 'reading', description: 'Explicación y ejercicios.' },
  pegSecond: { name: 'Second conditional', url: 'https://www.perfect-english-grammar.com/second-conditional.html', level: 'B1', category: 'reading', description: 'Explicación y ejercicios.' },
  bcCond: { name: 'British Council · conditionals', url: 'https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/conditionals-zero-first-second', level: 'B1', category: 'reading', description: 'Zero, first y second conditional con ejercicios.' },
  pegUsed: { name: 'Used to', url: 'https://www.perfect-english-grammar.com/used-to.html', level: 'B1', category: 'reading', description: 'Explicación y ejercicios.' },
  wai: { name: 'Write & Improve (Cambridge)', url: 'https://writeandimprove.com/', level: 'A1–C2', category: 'output', description: 'Corrige tu texto y estima tu nivel CEFR. Gratis, de Cambridge.' },
  bcB1w: { name: 'British Council · B1 writing', url: 'https://learnenglish.britishcouncil.org/skills/writing/b1-writing', level: 'B1', category: 'output', description: 'Modelos de emails, historias y opiniones con ejercicios.' },
  dictation: { name: 'dictation.io', url: 'https://dictation.io/', level: '—', category: 'output', description: 'Transcribe tus grabaciones para poder corregirlas.' },
  tandem: { name: 'Tandem', url: 'https://www.tandem.net/', level: 'A2+', category: 'output', description: 'Intercambio de idiomas gratuito, por texto, audio o video.' },
  hellotalk: { name: 'HelloTalk', url: 'https://www.hellotalk.com/', level: 'A2+', category: 'output', description: 'Como Tandem; los nativos corrigen tus mensajes.' },
  italki: { name: 'iTalki', url: 'https://www.italki.com/', level: 'A2+', category: 'output', description: 'Clases o conversación con profesores. De pago, opcional.' },
  youglish: { name: 'YouGlish', url: 'https://youglish.com/', level: 'Todos', category: 'tools', description: 'Escucha cualquier palabra dicha en miles de videos reales.' },
  oxford: { name: 'Oxford Learner’s Dictionaries', url: 'https://www.oxfordlearnersdictionaries.com/', level: 'Todos', category: 'tools', description: 'Diccionario para estudiantes con audio británico y americano.' },
  rachel: { name: 'Rachel’s English', url: 'https://www.youtube.com/@rachelsenglish', level: 'A2+', category: 'tools', description: 'Pronunciación del inglés americano paso a paso.' },
  anki: { name: 'Anki', url: 'https://apps.ankiweb.net/', level: '—', category: 'tools', description: 'Tarjetas con repaso espaciado. Gratis en Windows, Android y web.' },
  lr: { name: 'Language Reactor', url: 'https://www.languagereactor.com/', level: '—', category: 'tools', description: 'Extensión de Chrome: subtítulos dobles y pausa automática en YouTube y Netflix.' },
} satisfies Record<string, Resource>

export type ResourceKey = keyof typeof RESOURCES

export const GRAMMAR_ONLY: ReadonlySet<ResourceKey> = new Set<ResourceKey>([
  'pegPast', 'pegPastCont', 'pegPP', 'pegPPvsPS', 'pegFuture', 'pegComp', 'pegModal', 'pegFirst', 'pegSecond', 'bcCond', 'pegUsed',
])
