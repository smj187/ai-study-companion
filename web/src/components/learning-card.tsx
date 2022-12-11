import { useEffect, useState } from "react"
import { useAppContext } from "../context/app-context"

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
    return appQuestions[index].answerIsCorrect ? "good job" : "learn more"
  }

  // on mount set the first question as the active quetion
  useEffect(() => {
    updateActiveQuestion(appQuestions[index].id)
  }, [])

  const onLoadHelp = () => {
    console.log("TODO: add 'tell me more' here")
  }

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
        <button
          onClick={onLoadHelp}
          className="group hover:bg-slate-200/40 cursor-pointer hover:border-opacity-30 rounded h-12 w-12 grid place-items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
        </button>

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
