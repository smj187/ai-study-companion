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
}

export const useStore = create(
  persist<Store>(
    (set, get) => ({
      questions: [],
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
