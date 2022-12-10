import { createContext, ReactNode, useContext, useState } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"

interface Questions {
  id: string
  question: string
  answer: null | string
  visibleAnswer: boolean
  voiceInputFile: File | null
  voiceInputUrl: string | null
}

interface IAppContext {
  questions: Array<Questions>
  loadQuestions: () => void
  toggleVisibility: (id: string) => void
}

const AppContext = createContext({} as IAppContext)

export function useAppContext() {
  return useContext(AppContext)
}

export function AppContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [questions, setQuestions] = useLocalStorage<Array<Questions>>(
    "questions",
    [
      {
        id: "0",
        question: "Question #1",
        answer: null,
        visibleAnswer: false,
        voiceInputFile: null,
        voiceInputUrl: null
      },
      {
        id: "1",
        question: "Question #2",
        answer: null,
        visibleAnswer: false,
        voiceInputFile: null,
        voiceInputUrl: null
      },
      {
        id: "2",
        question: "Question #3",
        answer: null,
        visibleAnswer: false,
        voiceInputFile: null,
        voiceInputUrl: null
      },
      {
        id: "3",
        question: "Question #4",
        answer: null,
        visibleAnswer: false,
        voiceInputFile: null,
        voiceInputUrl: null
      },
      {
        id: "4",
        question: "Question #5",
        answer: null,
        visibleAnswer: false,
        voiceInputFile: null,
        voiceInputUrl: null
      },
      {
        id: "5",
        question: "Question #6",
        answer: null,
        visibleAnswer: false,
        voiceInputFile: null,
        voiceInputUrl: null
      }
    ]
  )

  function loadQuestions() {
    console.log("load")
  }

  function toggleVisibility(id: string) {
    const question = questions.find(q => q.id === id) ?? null

    if (question === null) {
      throw new Error("question is null")
    }

    question.visibleAnswer = !question.visibleAnswer

    setQuestions([...questions.filter(q => q.id !== id), question])
  }

  return (
    <AppContext.Provider
      value={{
        questions,
        loadQuestions,
        toggleVisibility
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
