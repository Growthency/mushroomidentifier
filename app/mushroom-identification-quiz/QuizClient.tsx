'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

/* ─────────────────────────────────────────────
   50 QUESTIONS
───────────────────────────────────────────── */
const QUESTIONS = [
  { q: 'What color are the gills of the Death Cap (Amanita phalloides)?', options: ['White', 'Pink', 'Brown', 'Yellow'], correct: 0 },
  { q: 'Which mushroom is known as the "Destroying Angel"?', options: ['Amanita bisporigera', 'Agaricus campestris', 'Cantharellus cibarius', 'Boletus edulis'], correct: 0 },
  { q: 'What is the cup-like structure at the base of an Amanita mushroom called?', options: ['Volva', 'Annulus', 'Pileus', 'Stipe'], correct: 0 },
  { q: 'The ring around a mushroom stem is called the...', options: ['Annulus', 'Volva', 'Mycelium', 'Rhizomorph'], correct: 0 },
  { q: 'Which part of the mushroom is called the "pileus"?', options: ['Cap', 'Stem', 'Gills', 'Base'], correct: 0 },
  { q: 'The gills of a mushroom are also scientifically called...', options: ['Lamellae', 'Rhizoids', 'Hyphae', 'Sporangia'], correct: 0 },
  { q: 'What color cap does the Death Cap (Amanita phalloides) typically have?', options: ['Greenish / olive', 'Pure white', 'Bright red', 'Dark brown'], correct: 0 },
  { q: 'Which mushroom has a bright red cap with white spots?', options: ['Amanita muscaria', 'Amanita phalloides', 'Boletus edulis', 'Agaricus bisporus'], correct: 0 },
  { q: 'What is the scientific name of the Chanterelle?', options: ['Cantharellus cibarius', 'Amanita caesarea', 'Boletus edulis', 'Pleurotus ostreatus'], correct: 0 },
  { q: 'Which mushroom is commonly called "Hen of the Woods"?', options: ['Grifola frondosa', 'Armillaria mellea', 'Laetiporus sulphureus', 'Hericium erinaceus'], correct: 0 },
  { q: 'What color does the Yellow Stainer (Agaricus xanthodermus) turn when cut?', options: ['Yellow', 'Blue', 'Red', 'Black'], correct: 0 },
  { q: 'Which mushroom is known as "Chicken of the Woods"?', options: ['Laetiporus sulphureus', 'Grifola frondosa', 'Pleurotus ostreatus', 'Hericium erinaceus'], correct: 0 },
  { q: 'What does "mycorrhizal" mean?', options: ['Symbiotic relationship with tree roots', 'Grows on dead wood', 'Parasitic on living trees', 'Grows in meadows'], correct: 0 },
  { q: 'Which part of a mushroom primarily produces and releases spores?', options: ['Gills', 'Cap', 'Stem', 'Volva'], correct: 0 },
  { q: 'The spore-bearing layer in fungi is called the...', options: ['Hymenium', 'Pileus', 'Stipe', 'Annulus'], correct: 0 },
  { q: 'What main toxin is found in the Death Cap mushroom?', options: ['Amatoxin', 'Ibotenic acid', 'Muscimol', 'Psilocybin'], correct: 0 },
  { q: 'Which mushroom is known as "King Bolete" or "Porcini"?', options: ['Boletus edulis', 'Boletus satanas', 'Boletus luridus', 'Boletus badius'], correct: 0 },
  { q: 'What does a mushroom spore print tell you?', options: ['Spore color, helpful for identification', 'Mushroom age', 'Toxicity level', 'Water content'], correct: 0 },
  { q: 'Which edible mushroom is often called "Oyster Mushroom"?', options: ['Pleurotus ostreatus', 'Agaricus bisporus', 'Cantharellus cibarius', 'Lentinula edodes'], correct: 0 },
  { q: 'What is the scientific name of the common white button mushroom?', options: ['Agaricus bisporus', 'Agaricus campestris', 'Agaricus xanthodermus', 'Agaricus sylvaticus'], correct: 0 },
  { q: 'Which mushroom is nicknamed "Lion\'s Mane"?', options: ['Hericium erinaceus', 'Grifola frondosa', 'Trametes versicolor', 'Inonotus obliquus'], correct: 0 },
  { q: 'What symptom does Amanita phalloides poisoning typically cause first?', options: ['Severe gastrointestinal distress', 'Hallucinations', 'Skin rash', 'Headache only'], correct: 0 },
  { q: 'Which mushroom is known as "Turkey Tail"?', options: ['Trametes versicolor', 'Grifola frondosa', 'Hericium erinaceus', 'Inonotus obliquus'], correct: 0 },
  { q: 'How long after eating a Death Cap do severe symptoms typically appear?', options: ['6–24 hours', '1–2 hours', 'Immediately', '3–5 days'], correct: 0 },
  { q: 'What shape is the cap of a young Death Cap mushroom?', options: ['Convex (rounded)', 'Flat', 'Funnel-shaped', 'Bell-shaped'], correct: 0 },
  { q: 'Which edible mushroom is commonly known as "Shiitake"?', options: ['Lentinula edodes', 'Pleurotus ostreatus', 'Grifola frondosa', 'Agaricus bisporus'], correct: 0 },
  { q: 'What does "saprotrophic" mean in mushroom ecology?', options: ['Breaks down dead organic matter', 'Lives in symbiosis with trees', 'Parasitic on living plants', 'Grows in water'], correct: 0 },
  { q: 'The underground network of fungal threads is called...', options: ['Mycelium', 'Rhizome', 'Sporangia', 'Stroma'], correct: 0 },
  { q: 'Which mushroom is bright orange and grows in shelf-like layers on trees?', options: ['Laetiporus sulphureus', 'Trametes versicolor', 'Ganoderma lucidum', 'Pleurotus ostreatus'], correct: 0 },
  { q: 'What is the horse mushroom\'s scientific name?', options: ['Agaricus arvensis', 'Agaricus campestris', 'Agaricus bisporus', 'Agaricus sylvaticus'], correct: 0 },
  { q: 'Which is a key identification feature of Amanita species?', options: ['Volva at base, ring on stem, white gills', 'Blue gills and red stem', 'Orange cap and no ring', 'Black spores and hollow stem'], correct: 0 },
  { q: 'Which mushroom is known to be bioluminescent (glows in the dark)?', options: ['Omphalotus olearius', 'Amanita muscaria', 'Boletus edulis', 'Cantharellus cibarius'], correct: 0 },
  { q: 'What color is the spore print of the Death Cap (Amanita phalloides)?', options: ['White', 'Black', 'Brown', 'Purple-brown'], correct: 0 },
  { q: 'What is a "fairy ring"?', options: ['A circular ring of mushrooms in grass', 'A type of toxic mushroom', 'The ring on an Amanita stem', 'A bioluminescent mushroom'], correct: 0 },
  { q: 'Which mushroom is known for its honeycomb-like cap?', options: ['Morchella esculenta (Morel)', 'Gyromitra esculenta', 'Hericium erinaceus', 'Grifola frondosa'], correct: 0 },
  { q: 'What toxic compounds are found in Amanita muscaria?', options: ['Muscimol and ibotenic acid', 'Amatoxin', 'Psilocybin', 'Ergotamine'], correct: 0 },
  { q: 'Which trees do Porcini mushrooms (Boletus edulis) typically grow near?', options: ['Oak, pine, and spruce', 'Birch only', 'Palm trees', 'Bamboo'], correct: 0 },
  { q: 'What color are Chanterelle mushrooms?', options: ['Golden yellow to orange', 'Bright red', 'Pure white', 'Dark brown'], correct: 0 },
  { q: 'Which mushroom is called the "False Chanterelle"?', options: ['Hygrophoropsis aurantiaca', 'Omphalotus olearius', 'Cantharellus tubaeformis', 'Craterellus cornucopioides'], correct: 0 },
  { q: 'What does a ring (annulus) on a mushroom stem indicate?', options: ['The partial veil has broken', 'The mushroom is poisonous', 'The mushroom is very old', 'The mushroom grows near water'], correct: 0 },
  { q: 'Which deadly mushroom is often mistaken for a field mushroom by beginners?', options: ['Amanita phalloides (Death Cap)', 'Amanita muscaria', 'Boletus satanas', 'Cortinarius speciosissimus'], correct: 0 },
  { q: 'What habitat does the Oyster Mushroom (Pleurotus ostreatus) prefer?', options: ['Dead or dying wood', 'Meadows and grasslands', 'Sandy desert soil', 'Underwater on rocks'], correct: 0 },
  { q: 'Which mushroom turns blue when cut or bruised?', options: ['Boletus luridus', 'Cantharellus cibarius', 'Agaricus campestris', 'Pleurotus ostreatus'], correct: 0 },
  { q: 'What mainly distinguishes Amanita from Agaricus mushrooms?', options: ['Amanita has a volva and white gills; Agaricus lacks a volva', 'Amanita has brown gills', 'Agaricus always grows on wood', 'Amanita has a hollow stem'], correct: 0 },
  { q: 'Which is a safe edibility sign for Agaricus mushrooms?', options: ['Gills turn pink to brown with age', 'Gills stay white forever', 'Strong anise smell means toxic', 'Yellow staining means safe'], correct: 0 },
  { q: 'What color are the gills of a common field mushroom (Agaricus campestris) when young?', options: ['Pink', 'White', 'Brown', 'Black'], correct: 0 },
  { q: 'Which region is the European Destroying Angel (Amanita virosa) most associated with?', options: ['Scotland and northern Europe', 'Australia', 'Japan', 'South America'], correct: 0 },
  { q: 'What does a "spore print" mean?', options: ['Pattern left by spores falling from the cap', 'A footprint left by a mushroom in soil', 'The texture of a mushroom\'s surface', 'A test for toxicity'], correct: 0 },
  { q: 'Which feature of the Destroying Angel is most often missed, causing fatal poisoning?', options: ['The volva buried underground', 'The color of the cap', 'The smell of the gills', 'The size of the ring'], correct: 0 },
  { q: 'What should you do if you suspect mushroom poisoning?', options: ['Seek immediate medical attention', 'Drink water and rest', 'Eat bread to absorb toxins', 'Wait 24 hours for symptoms'], correct: 0 },
]

const TIMER_DURATION = 30

type Phase = 'article' | 'quiz' | 'results'

/* ── Shuffle answer options while keeping track of correct index ── */
function shuffleOptions(q: typeof QUESTIONS[0]) {
  const indexed = q.options.map((opt, i) => ({ opt, isCorrect: i === q.correct }))
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]]
  }
  return {
    q: q.q,
    options: indexed.map(x => x.opt),
    correct: indexed.findIndex(x => x.isCorrect),
  }
}

export default function QuizClient() {
  const [phase, setPhase] = useState<Phase>('article')
  const [questions, setQuestions] = useState<Array<{ q: string; options: string[]; correct: number }>>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<(number | null)[]>(Array(50).fill(null))
  const [answered, setAnswered] = useState(false)
  const [timer, setTimer] = useState(TIMER_DURATION)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  /* load high score */
  useEffect(() => {
    const saved = parseInt(localStorage.getItem('mushroom_quiz_highscore') || '0', 10)
    setHighScore(saved)
  }, [])

  /* shuffle questions when quiz starts */
  const startQuiz = useCallback(() => {
    const shuffled = QUESTIONS.map(q => shuffleOptions(q))
    setQuestions(shuffled)
    setSelected(Array(50).fill(null))
    setCurrent(0)
    setAnswered(false)
    setScore(0)
    setTimer(TIMER_DURATION)
    setPhase('quiz')
  }, [])

  /* timer */
  useEffect(() => {
    if (phase !== 'quiz' || answered) return
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setAnswered(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase, current, answered])

  const handleAnswer = (idx: number) => {
    if (answered) return
    clearInterval(timerRef.current!)
    const correct = questions[current].correct
    const newSelected = [...selected]
    newSelected[current] = idx
    setSelected(newSelected)
    setAnswered(true)
    if (idx === correct) setScore(s => s + 1)
  }

  const next = () => {
    if (current + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrent(c => c + 1)
      setAnswered(false)
      setTimer(TIMER_DURATION)
    }
  }

  const prev = () => {
    if (current > 0) {
      setCurrent(c => c - 1)
      setAnswered(selected[current - 1] !== null)
      setTimer(TIMER_DURATION)
    }
  }

  const finishQuiz = useCallback(() => {
    clearInterval(timerRef.current!)
    const finalScore = score + (selected[current] === questions[current]?.correct && selected[current] !== null ? 0 : 0)
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('mushroom_quiz_highscore', String(score))
    }
    setPhase('results')
  }, [score, highScore, selected, current, questions])

  const restart = () => startQuiz()
  const exitToArticle = () => {
    clearInterval(timerRef.current!)
    setPhase('article')
  }

  const pct = Math.round((score / 50) * 100)
  const circumference = 2 * Math.PI * 54
  const strokeDash = circumference - (circumference * pct) / 100

  /* ── ARTICLE (top + bottom) ── */
  const ArticleTop = () => (
    <section className="mb-12">
      <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
        What Is a Mushroom Identification Quiz?
      </h2>
      <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        <p>
          A <strong style={{ color: 'var(--text-primary)' }}>mushroom identification quiz</strong> is an interactive tool designed to
          help foragers, students, hikers, and nature enthusiasts test and sharpen their knowledge of fungal species.
          Whether you are a complete beginner or an experienced mycologist, a quiz-based approach is one of the most
          effective ways to build pattern recognition skills that are essential for safe identification in the wild.
        </p>
        <p>
          Mushroom identification is not a single-feature exercise. Accurate recognition requires evaluating the cap
          shape, gill color and attachment, stem structure, presence of a ring (annulus) or volva, spore print color,
          habitat, and seasonal timing. Our quiz covers all of these aspects across 50 carefully crafted questions,
          from toxic species like <em>Amanita phalloides</em> and <em>Amanita bisporigera</em> to prized edibles like
          Chanterelles, Porcini, and Oyster mushrooms.
        </p>
        <p>
          The quiz is designed to simulate the rapid decision-making that real-world mushroom identification demands.
          Each question gives you <strong style={{ color: 'var(--text-primary)' }}>30 seconds</strong> to select the
          correct answer from four options — mirroring the time pressure a forager faces in the field when they need
          to assess an unfamiliar specimen quickly and confidently.
        </p>
      </div>

      <figure className="my-8 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <Image
          src="/mushroom-identification-quiz-various-species.webp"
          alt="Mushroom identification quiz — various edible fungal species for testing knowledge"
          width={820}
          height={671}
          className="w-full object-cover"
          style={{ maxHeight: '400px', objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <figcaption className="px-4 py-2 text-xs text-center" style={{ color: 'var(--text-faint)', background: 'var(--bg-card)' }}>
          19 edible fungal species illustration. Photo: Wellcome Collection, CC BY 4.0, via Wikimedia Commons
        </figcaption>
      </figure>

      <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-5 mt-10" style={{ color: 'var(--text-primary)' }}>
        Why Take a Mushroom Knowledge Quiz?
      </h2>
      <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        <p>
          The consequences of misidentifying a mushroom can be life-threatening. The Death Cap alone accounts for
          the majority of fatal mushroom poisonings worldwide, and it closely resembles several common edible
          species. Building a solid knowledge base through repeated quiz practice helps create the kind of deep,
          automatic recognition that can prevent dangerous mistakes.
        </p>
        <p>
          Beyond safety, mushroom quizzes are genuinely fun and educational. Testing yourself on species like
          <em> Laetiporus sulphureus</em> (Chicken of the Woods), <em>Hericium erinaceus</em> (Lion's Mane), and
          <em> Trametes versicolor</em> (Turkey Tail) builds a mental library that makes forest walks far more
          rewarding and informative.
        </p>
        <p>
          Our quiz also includes questions on mushroom anatomy terms — pileus, lamellae, stipe, annulus, volva,
          hymenium — which form the scientific vocabulary every forager should know. Understanding the correct
          terminology makes it easier to communicate with experts, read field guides, and use identification apps
          effectively.
        </p>
        <p>
          The high score system adds a competitive element: challenge yourself to beat your previous score, or
          share your result and challenge a friend. Each restart shuffles the answer options, so no two attempts
          feel exactly the same.
        </p>
      </div>
    </section>
  )

  const ArticleBottom = () => (
    <section className="mt-16">
      <hr className="mb-12 border-0 border-t" style={{ borderColor: 'var(--border)' }} />
      <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
        How to Get the Best Score
      </h2>
      <div className="space-y-4 text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
        <p>
          Start by reviewing our guides on <Link href="/amanita-phalloides-death-cap" style={{ color: 'var(--accent)' }}>Amanita phalloides</Link>,{' '}
          <Link href="/amanita-bisporigera-destroying-angel" style={{ color: 'var(--accent)' }}>Amanita bisporigera</Link>, and{' '}
          <Link href="/mushroom-parts-explained" style={{ color: 'var(--accent)' }}>mushroom anatomy</Link> before attempting
          the quiz. Understanding the difference between a volva and an annulus, or why gills that stay white are a danger
          signal, will dramatically improve your score.
        </p>
        <p>
          Focus on high-risk look-alike pairs: Death Cap vs. field mushrooms, Destroying Angel vs. button mushrooms,
          and False Chanterelle vs. true Chanterelle. These confusions are the most common and the most dangerous.
        </p>
        <p>
          Remember: the quiz is a learning tool, not a replacement for real-world expert verification. Always consult
          a professional mycologist before consuming any wild mushroom. Use our{' '}
          <Link href="/" style={{ color: 'var(--accent)' }}>AI mushroom identifier</Link> as a first research step, and
          treat quiz scores as a measure of your growing knowledge, not as field certification.
        </p>
      </div>
      <div className="p-5 rounded-xl flex gap-3" style={{ background: '#ef444415', border: '1px solid #ef444440' }}>
        <span className="text-xl">⚠️</span>
        <p className="text-sm leading-relaxed" style={{ color: '#fca5a5' }}>
          <strong>Safety reminder:</strong> No quiz score, app result, or field guide can substitute for expert
          mycological verification. Never eat a wild mushroom unless it has been confirmed by a qualified expert.
        </p>
      </div>
    </section>
  )

  /* ── QUIZ PHASE ── */
  if (phase === 'quiz' && questions.length > 0) {
    const q = questions[current]
    const sel = selected[current]
    const timerPct = (timer / TIMER_DURATION) * 100
    const timerColor = timer > 15 ? '#22c55e' : timer > 7 ? '#f97316' : '#ef4444'

    return (
      <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-3xl mx-auto px-5 md:px-6">

          {/* Header bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                Q {current + 1} / {questions.length}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-faint)' }}>Score: <strong style={{ color: 'var(--accent)' }}>{score}</strong></span>
            </div>
            <button onClick={exitToArticle} className="text-xs px-3 py-1 rounded-full transition-opacity hover:opacity-70" style={{ border: '1px solid var(--border)', color: 'var(--text-faint)' }}>
              ✕ Exit Quiz
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((current + 1) / questions.length) * 100}%`, background: 'var(--accent)' }} />
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 linear"
                style={{ width: `${timerPct}%`, background: timerColor }}
              />
            </div>
            <span className="text-xl font-bold w-10 text-right tabular-nums" style={{ color: timerColor }}>{timer}</span>
            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>sec</span>
          </div>

          {/* Question */}
          <div className="p-6 rounded-2xl mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <p className="text-lg md:text-xl font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {q.q}
            </p>
          </div>

          {/* Answer options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {q.options.map((opt, i) => {
              let bg = 'var(--bg-card)'
              let border = 'var(--border)'
              let textColor = 'var(--text-primary)'
              if (answered || timer === 0) {
                if (i === q.correct) { bg = 'rgba(34,197,94,0.15)'; border = '#22c55e'; textColor = '#22c55e' }
                else if (i === sel) { bg = 'rgba(239,68,68,0.15)'; border = '#ef4444'; textColor = '#ef4444' }
              }
              const isClickable = !answered && timer > 0
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={!isClickable}
                  className="p-4 rounded-xl text-left text-sm font-medium transition-all duration-200 flex items-center gap-3"
                  style={{ background: bg, border: `1.5px solid ${border}`, color: textColor, cursor: isClickable ? 'pointer' : 'default', opacity: answered && i !== q.correct && i !== sel ? 0.5 : 1 }}
                >
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--bg-secondary)', color: 'var(--text-faint)' }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Timer expired message */}
          {timer === 0 && !answered && (
            <div className="mb-4 text-center text-sm font-medium" style={{ color: '#ef4444' }}>Time's up! The correct answer is highlighted in green.</div>
          )}
          {answered && timer === 0 && (
            <div className="mb-4 text-center text-sm font-medium" style={{ color: '#fca5a5' }}>Time expired — no point awarded for this question.</div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={prev}
              disabled={current === 0}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity disabled:opacity-30"
              style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              ← Prev
            </button>
            <button
              onClick={restart}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
              style={{ border: '1px solid var(--border)', color: 'var(--text-faint)' }}
            >
              ↺ Restart
            </button>
            {answered || timer === 0 ? (
              <button
                onClick={next}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--btn-primary)', color: '#fff' }}
              >
                {current + 1 >= questions.length ? 'See Results →' : 'Next →'}
              </button>
            ) : (
              <div className="px-6 py-2.5 rounded-xl text-sm font-semibold opacity-30 select-none" style={{ background: 'var(--btn-primary)', color: '#fff' }}>
                Next →
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ── RESULTS PHASE ── */
  if (phase === 'results') {
    const isNewHigh = score >= highScore
    const grade = pct >= 90 ? { label: 'Expert Mycologist 🏆', color: '#22c55e' } : pct >= 70 ? { label: 'Advanced Forager 🌿', color: '#84cc16' } : pct >= 50 ? { label: 'Intermediate Learner 🍄', color: '#f97316' } : { label: 'Beginner — Keep Studying! 📚', color: '#ef4444' }
    return (
      <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-2xl mx-auto px-5 md:px-6 text-center">

          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Quiz Complete!</h1>
          <p className="mb-10 text-sm" style={{ color: 'var(--text-faint)' }}>Mushroom Identification Quiz — 50 Questions</p>

          {/* Donut chart */}
          <div className="flex justify-center mb-8">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" strokeWidth="10" stroke="var(--bg-secondary)" />
                <circle
                  cx="60" cy="60" r="54" fill="none" strokeWidth="10"
                  stroke={grade.color}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDash}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-playfair" style={{ color: 'var(--text-primary)' }}>{score}</span>
                <span className="text-sm" style={{ color: 'var(--text-faint)' }}>/ 50</span>
              </div>
            </div>
          </div>

          {/* Grade */}
          <div className="mb-8">
            <span className="inline-block px-5 py-2 rounded-full text-sm font-bold mb-3" style={{ background: `${grade.color}20`, color: grade.color }}>{grade.label}</span>
            <div className="text-5xl font-bold font-playfair mb-1" style={{ color: grade.color }}>{pct}%</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>You answered {score} out of 50 questions correctly</p>
          </div>

          {/* High score */}
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: '120px' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>{score}</div>
              <div className="text-xs" style={{ color: 'var(--text-faint)' }}>This Round</div>
            </div>
            <div className="p-4 rounded-xl text-center" style={{ background: isNewHigh ? 'rgba(34,197,94,0.1)' : 'var(--bg-card)', border: `1px solid ${isNewHigh ? '#22c55e40' : 'var(--border)'}`, minWidth: '120px' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: isNewHigh ? '#22c55e' : 'var(--text-primary)' }}>
                {Math.max(score, highScore)} {isNewHigh && score > 0 && <span className="text-sm">🏆</span>}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-faint)' }}>High Score</div>
            </div>
          </div>

          {isNewHigh && score > 0 && (
            <div className="mb-8 p-4 rounded-xl text-sm font-medium" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e40', color: '#22c55e' }}>
              🎉 New personal high score! Great work!
            </div>
          )}

          {/* Percentage bar breakdown */}
          <div className="mb-10 p-5 rounded-xl text-left" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-primary)' }}>Performance Breakdown</h3>
            {[
              { label: 'Correct', count: score, color: '#22c55e' },
              { label: 'Incorrect / Skipped', count: 50 - score, color: '#ef4444' },
            ].map(({ label, count, color }) => (
              <div key={label} className="mb-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <span>{label}</span><span style={{ color }}>{count}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(count / 50) * 100}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restart}
              className="px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'var(--btn-primary)', color: '#fff' }}
            >
              ↺ Play Again — Beat Your Score
            </button>
            <button
              onClick={exitToArticle}
              className="px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
              style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              ← Back to Article
            </button>
          </div>
          <p className="mt-6 text-xs" style={{ color: 'var(--text-faint)' }}>Answer options are shuffled each time — try again for a new challenge!</p>
        </div>
      </div>
    )
  }

  /* ── ARTICLE PHASE ── */
  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-5 md:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color: 'var(--text-faint)' }}>
          <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:underline" style={{ color: 'var(--accent)' }}>Blog</Link>
          <span>/</span>
          <span>Mushroom Identification Quiz</span>
        </nav>

        {/* Title */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>Interactive Quiz</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>50 Questions</span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>30s Timer</span>
          </div>
          <h1 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Mushroom Identification Quiz: Test Your Fungi Knowledge
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            50 expert questions covering toxic species, edible mushrooms, anatomy terms, habitat, and look-alikes.
            30 seconds per question. Track your high score and challenge yourself to improve.
          </p>
        </div>

        {/* Article top */}
        <ArticleTop />

        {/* START QUIZ BUTTON */}
        <div className="my-12 flex flex-col items-center gap-4 p-8 rounded-2xl text-center" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
          <div className="text-5xl mb-2">🍄</div>
          <h2 className="font-playfair text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Ready to Test Your Knowledge?</h2>
          <p className="text-sm max-w-md" style={{ color: 'var(--text-muted)' }}>
            50 questions · 30 seconds each · 4 answer choices · Instant feedback · High score tracking
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { icon: '⏱️', text: '30s per question' },
              { icon: '🎯', text: '4 choices each' },
              { icon: '🟩', text: 'Green = Correct' },
              { icon: '🟥', text: 'Red = Wrong' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                <span>{icon}</span> {text}
              </div>
            ))}
          </div>
          <button
            onClick={startQuiz}
            className="mt-2 px-10 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-all shadow-lg"
            style={{ background: 'var(--btn-primary)', color: '#fff' }}
          >
            Start Quiz →
          </button>
          {highScore > 0 && (
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
              🏆 Your high score: <strong style={{ color: 'var(--accent)' }}>{highScore} / 50</strong>
            </p>
          )}
        </div>

        {/* Article bottom */}
        <ArticleBottom />
      </div>
    </div>
  )
}
