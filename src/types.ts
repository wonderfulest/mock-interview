export interface Question {
  id: string
  track: string
  difficulty: number
  prompt: string
  points: string[]
  answer: string
  tags: string[]
}

export interface Track { key: string; label: string }
