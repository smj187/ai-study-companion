import { useState } from "react"
import { useAppContext } from "../context/app-context"
import { twMerge } from "tailwind-merge"
import { UseRecorder } from "../types/recorder"
import useRecorder from "../hooks/use-recorder"
import RecorderControls from "../components/recorder-controls"
import RecordingsList from "../components/recordings-list"
import { Recorder } from "vmsg"
import { VoiceRecorder } from "../components/voice-recorder"

export const AppView: React.FC = () => {
  const { questions, toggleVisibility } = useAppContext()
  const [selected, setSelected] = useState("Learning")

  const [index, setIndex] = useState(0)

  const decreaseIndex = () => {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  const increaseIndex = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
    }
  }

  const [isRecording, setIsRecording] = useState(false)

  const onRecord = () => {
    setIsRecording(true)
  }

  const onStopRecording = () => {
    setIsRecording(false)
  }

  const { recorderState, ...handlers }: UseRecorder = useRecorder()
  const { audio } = recorderState

  const showAnwser = (id: string) => {
    toggleVisibility(id)
  }

  return (
    <div className="font-inter ">
      <VoiceRecorder />
      <div className="flex space-x-3">
        <div
          onClick={() => showAnwser(questions[index].id)}
          className="flex justify-center items-center w-full h-40  transition border border-gray-300 border-opacity-70  rounded-md appearance-none"
        >
          {questions[index].visibleAnswer ? (
            <div>click here to get chatGPT</div>
          ) : (
            <div>anwser: {questions[index].answer} </div>
          )}
        </div>
        <div className="flex  w-full h-40">
          <div className="my-auto ml-9">
            <button className="bg-rose-500 hover:bg-rose-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
              tell me more
            </button>
          </div>
        </div>
      </div>
      <div className="flex space-x-3 pt-9">
        <div className="flex justify-center items-center w-full h-40  transition border border-gray-300 border-opacity-70  rounded-md appearance-none">
          {questions[index].question}
        </div>
        <div className="flex justify-center items-center w-full h-40  transition border border-gray-300 border-opacity-70  rounded-md appearance-none">
          your anwser is correct
        </div>
      </div>
      <div className="flex space-x-3 mb-6 mt-3">
        <div
          onClick={decreaseIndex}
          className="border group border-gray-300 hover:bg-gray-300/30 cursor-pointer hover:border-opacity-30 rounded h-12 w-12 grid place-items-center"
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
        </div>
        <div
          onClick={increaseIndex}
          className="border group border-gray-300 hover:bg-gray-300/30 transform rotate-180 cursor-pointer hover:border-opacity-30 rounded h-12 w-12 grid place-items-center"
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
        </div>
      </div>

      <RecorderControls recorderState={recorderState} handlers={handlers} />
      <RecordingsList audio={audio} />
    </div>
  )
}
