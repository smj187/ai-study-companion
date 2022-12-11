import { useEffect, useState } from "react"
import { useAppContext } from "../context/app-context"
import { PopUp } from "../components/popup"

interface Props {
  title?: string | null
}

const Student = () => {
  return (
    <span className="font-bold text-slate-500 pr-3 w-full max-w-xs  text-right">
      Student
    </span>
  )
}

const Professor = () => {
  return (
    <span className="font-bold text-rose-500 pr-3 w-full max-w-xs  text-right">
      professor.ai
    </span>
  )
}

const Text: React.FC<{ text: string }> = ({ text }) => {
  return <span className="text-slate-500 w-full">{text}</span>
}

export const LearningCard: React.FC<Props> = ({ title = null }) => {
  const { appQuestions, updateActiveQuestion } = useAppContext()

  const [index, setIndex] = useState(0)

  const decreaseIndex = () => {
    if (index > 0) {
      setIndex(index - 1)
    }

    updateActiveQuestion(appQuestions[index].id)
  }

  const increaseIndex = () => {
    if (index + 1 < appQuestions.length) {
      setIndex(index + 1)
    }
    updateActiveQuestion(appQuestions[index].id)
  }

  const getActiveMessage = () => {
    return appQuestions[index].question
  }

  const getUserAnswer = () => {
    return appQuestions[index].userAnswer ?? null
  }

  const getCorrectUserAnswer = () => {
    const correctAnswers = ["Good job!", "Nice one!", "This is correct!"]
    const falseAnswers = ["Try again.", "This is not correct. Have another try!"]
    const randomCorrectAnswer = correctAnswers[Math.floor(Math.random() * correctAnswers.length)]
    const randomFalseAnswer = falseAnswers[Math.floor(Math.random() * falseAnswers.length)]
    return appQuestions[index].answerIsCorrect ? randomCorrectAnswer : randomFalseAnswer
  }

  // on mount set the first question as the active quetion
  useEffect(() => {
    updateActiveQuestion(appQuestions[index].id)
  }, [])

  return (
    <div className="relative flex justify-center items-center w-full h-[500px] bg-white rounded-md">
      {title !== null && (
        <span className="text-sm text-slate-400 absolute top-2 left-4 cursor-default">
          {title}
        </span>
      )}

      <div className="flex flex-col space-y-3 w-full">
        <div className="w-full flex ">
          <Professor />
          <span className="text-slate-500 w-full flex-1">
            {getActiveMessage()}
          </span>
        </div>
        {getUserAnswer() !== null && (
          <>
            {/* the user answer */}
            <div className="w-full flex">
              <Student />
              <span className="text-slate-500 w-full">{getUserAnswer()}</span>
            </div>
            {/* the professor telling you if your answer is correct */}
            <div className="w-full flex ">
              <Professor />
              <span className="text-slate-500 w-full flex-1">
                {getCorrectUserAnswer()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* navigation buttons */}
      <div className="absolute bottom-1 right-1 flex space-x-1 items-center">
        <PopUp title="Answer" text="Generate Questions...TODO"/>

        <span className="text-slate-300 px-3">|</span>

        <button
          onClick={decreaseIndex}
          className="group hover:bg-slate-200/40 cursor-pointer hover:border-opacity-30 rounded h-12 w-12 grid place-items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-600 group-hover:text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <button
          onClick={increaseIndex}
          className="group hover:bg-slate-200/40 transform rotate-180 cursor-pointer hover:border-opacity-30 rounded h-12 w-12 grid place-items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-600 group-hover:text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
