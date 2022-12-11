// types & models

export interface AppQuestionModel {
  id: string
  question: string

  chatGptAnswer: string | null
  userAnswer: string | null // -> what the user entered and got transcribed
  answerIsCorrect: boolean | null // -> not yet answert
}
