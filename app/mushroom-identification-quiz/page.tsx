import type { Metadata } from 'next'
import QuizClient from './QuizClient'

export const metadata: Metadata = {
  title: 'Mushroom Identification Quiz — Test Your Fungi Knowledge | Mushroom Identifier',
  description:
    'Take our free mushroom identification quiz with 50 expert questions. Test your knowledge of toxic, edible, and look-alike mushroom species. 30-second timer per question!',
}

export default function MushroomQuizPage() {
  return <QuizClient />
}
