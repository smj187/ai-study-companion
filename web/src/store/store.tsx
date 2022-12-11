import { AppQuestionModel } from "../types"
import create from "zustand"
import { devtools, persist } from "zustand/middleware"
import { nanoid } from "nanoid"

type Store = {
  questions: Array<AppQuestionModel>

  addQuestion: (
    newQuestion: string,
    assemblyAnswer: string,
    chatGptAnswer: string
  ) => void

  addUserAnswer: (id: string, userAnswer: string, correct: boolean) => void

  removeQuestion: (id: string) => void
  removeUserAnswer: (id: string) => void

  findNextQuestion: (id: string) => AppQuestionModel
  findPrevQuestion: (id: string) => AppQuestionModel
}

export const useStore = create(
  persist<Store>(
    (set, get) => ({
      questions: [],
      removeUserAnswer: (id: string) => {
        set(state => ({
          ...state,
          questions: [
            ...state.questions.map(q => {
              if (q.id === id) {
                return { ...q, userAnswer: null }
              }
              return q
            })
          ]
        }))
      },
      findPrevQuestion: (id: string) => {
        const index = get().questions.findIndex(q => q.id === id)
        const prevQustion = get().questions[index - 1] ?? null
        if (prevQustion !== null) {
          return prevQustion
        }

        return get().questions[index]
      },
      findNextQuestion: (id: string) => {
        // find index of current id
        const index = get().questions.findIndex(q => q.id === id)
        const nextQustion = get().questions[index + 1] ?? null
        if (nextQustion !== null) {
          return nextQustion
        }

        return get().questions[index]
      },
      addQuestion: (
        newQuestion: string,
        assemblyAnswer: string,
        chatGptAnswer: string
      ) => {
        const question: AppQuestionModel = {
          id: nanoid(),
          question: newQuestion,
          assemblyAnswer: assemblyAnswer,
          chatGptAnswer: chatGptAnswer,
          userAnswer: null,
          answerIsCorrect: null
        }

        set(state => ({ ...state, questions: [...state.questions, question] }))
      },
      addUserAnswer: (id: string, userAnswer: string, correct: boolean) => {
        set(state => ({
          ...state,
          questions: [
            ...state.questions.map(q => {
              if (q.id === id) {
                console.log("add user msg lol", userAnswer)

                return {
                  ...q,
                  userAnswer: userAnswer,
                  answerIsCorrect: correct
                }
              }
              return q
            })
          ]
        }))

        console.log(get().questions)
      },

      removeQuestion: (id: string) => {
        set(state => ({
          ...state,
          questions: [...state.questions.filter(q => q.id !== id)]
        }))
      }
    }),
    {
      name: "store",
      getStorage: () => localStorage
    }
  )
)
