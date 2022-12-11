import { useEffect, useState } from "react"
import { useAppContext } from "../context/app-context"
import { twMerge } from "tailwind-merge"
import { Recorder } from "vmsg"
import { VoiceRecorder } from "../components/voice-recorder"
import { Quiz } from "../components/quiz"
import { AppQuestionModel } from "../types"
import { useStore } from "../store/store"

export const AppView: React.FC = () => {
  const store = useStore()

  const [activeQuestion, setActiveQuestion] = useState<AppQuestionModel | null>(
    () => {
      return store.questions[0] ?? null
    }
  )

  const decreaseIndex = () => {
    if (activeQuestion !== null) {
      const p = store.findPrevQuestion(activeQuestion.id)
      setActiveQuestion(p)
    }
  }

  const increaseIndex = () => {
    if (activeQuestion !== null) {
      const n = store.findNextQuestion(activeQuestion.id)
      setActiveQuestion(n)
    }
  }

  const onUpdateActiveQuestionDetails = (question: AppQuestionModel) => {
    setActiveQuestion(question)
  }

  return (
    <div className="font-inter ">
      <Quiz
        activeQuestion={activeQuestion}
        decreaseIndex={decreaseIndex}
        increaseIndex={increaseIndex}
      />
      <VoiceRecorder
        activeQuestion={activeQuestion}
        onUpdateActiveQuestionDetails={onUpdateActiveQuestionDetails}
      />
    </div>
  )
}
