import { useEffect, useState } from "react"
import { useAppContext } from "../context/app-context"
import { PopUp } from "../components/popup"
import { useStore } from "../store/store"
import { AppQuestionModel } from "../types"
interface Props {
  title?: string | null
  activeQuestion: AppQuestionModel | null
  decreaseIndex: () => void
  increaseIndex: () => void
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
      Professor.ai
    </span>
  )
}

const Text: React.FC<{ text: string }> = ({ text }) => {
  return <span className="text-slate-500 w-full">{text}</span>
}

export const LearningCard: React.FC<Props> = ({
  title = null,
  activeQuestion,
  decreaseIndex,
  increaseIndex
}) => {
  const getActiveMessage = () => {
    return (
      activeQuestion?.question ??
      "There is no question available. Automatically generate one via the 'My Files' tab!"
    )
  }

  const getCorrectAnswer = () => {
    return activeQuestion?.assemblyAnswer ?? null
  }

  const getUserAnswer = () => {
    return activeQuestion?.userAnswer ?? null
  }

  const getCorrectUserAnswer = () => {
      return activeQuestion?.answerIsCorrect
        ? "This is correct!"
        : "This is not completely correct. Have another try!"
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
          <span className="text-slate-500 w-full flex-1 pr-3">
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
        <PopUp title="Correct Answer" text={getCorrectAnswer()} />

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
