import { nanoid } from "nanoid"
import { createContext, ReactNode, useContext, useState } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { AppQuestionModel } from "../types"

interface Questions {
  id: string
  question: string
  answer: null | string
  visibleAnswer: boolean
  voiceInputFile: File | null
  voiceInputUrl: string | null
}

interface IAppContext {
  // global stuff:
  // stores which question is currently viewed inside the quiz
  currentlyActiveQuestionId: string | null
  updateActiveQuestion: (id: string) => void

  // app question
  appQuestions: Array<AppQuestionModel>
  addQuestion: (newQuestion: string, assemblyAnswer: string, chatGptAnswer: string) => void
  removeQuestion: (id: string) => void
  addUserAnswer: (id: string, userAnswer: string, correct: boolean) => void

  // TODO: delete this stuff
  questions: Array<Questions>

  loadQuestions: () => void
  toggleVisibility: (id: string) => void
  clearStorage: () => void
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
  const [appQuestions, setAppQuestions] = useState<Array<AppQuestionModel>>([
    {
      id: nanoid(),
      assemblyAnswer: "Answer Assembly",
      chatGptAnswer: "Answer GPT",
      userAnswer: null,
      question:
        "What is the approach that wealthy individuals take when considering large purchases?",
      answerIsCorrect: null
    },
    {
      id: nanoid(),
      assemblyAnswer: "This should be 2.",
      chatGptAnswer: "Could be 3.",
      userAnswer: null,
      question: "What is 1+1 ?",
      answerIsCorrect: null
    }
  ])

  const [currentlyActiveQuestionId, setCurrentlyActiveQuestionId] = useState<
    string | null
  >(null)

  function updateActiveQuestion(id: string) {
    setCurrentlyActiveQuestionId(id)
  }

  // adds a new question to the context store
  function addQuestion(newQuestion: string, assemblyAnswer: string, chatGptAnswer: string) {
    const appQuestion: AppQuestionModel = {
      id: nanoid(),
      question: newQuestion,
      assemblyAnswer: assemblyAnswer,
      chatGptAnswer: chatGptAnswer,
      userAnswer: null,
      answerIsCorrect: null
    }

    setAppQuestions([...appQuestions, appQuestion])
  }

  // removes a question by id
  function removeQuestion(id: string) {
    setAppQuestions([
      ...appQuestions.filter(appQuestion => appQuestion.id !== id)
    ])
  }

  // tries to add a user generated answer to a question object
  function addUserAnswer(id: string, userAnswer: string, correct: boolean) {
    setAppQuestions([
      ...appQuestions.map(appQuestion => {
        if (appQuestion.id === id) {
          console.log("hi", userAnswer)

          return {
            ...appQuestion,
            userAnswer: userAnswer,
            answerIsCorrect: correct
          }
        }
        return appQuestion
      })
    ])

    console.log(appQuestions)
  }

  const [questions, setQuestions] = useLocalStorage<Array<Questions>>(
    "questions",
    []
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

  function clearStorage() {
    localStorage.clear()
  }

  return (
    <AppContext.Provider
      value={{
        appQuestions,
        addQuestion,
        removeQuestion,
        addUserAnswer,

        currentlyActiveQuestionId,
        updateActiveQuestion,

        questions,
        loadQuestions,
        toggleVisibility,
        clearStorage
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
