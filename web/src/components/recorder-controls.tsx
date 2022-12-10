import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { RecorderControlsProps } from "../types/recorder"
import { formatMinutes, formatSeconds } from "../utils/helpers"
import "./styles.css"

export default function RecorderControls({
  recorderState,
  handlers
}: RecorderControlsProps) {
  const { recordingMinutes, recordingSeconds, initRecording } = recorderState
  const { startRecording, saveRecording, cancelRecording } = handlers

  return (
    <div className="mt-9">
      <div>
        <div className="flex justify-center">
          {initRecording ? (
            <div
              className="w-20 h-20 rounded-full relative cursor-pointer shadow-md "
              onClick={saveRecording}
            >
              <button
                disabled={recordingSeconds === 0}
                className="rounded-full cursor-pointer h-full w-full  transition duration-300 ease-in-out bg-white hover:bg-slate-50 hover:bg-opacity-70"
              ></button>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-full relative cursor-pointer shadow-md "
              onClick={startRecording}
            >
              <button className="rounded-full h-full w-full cursor-pointer transition duration-300 ease-in-out bg-white hover:bg-slate-50 hover:bg-opacity-70"></button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
              </svg>
            </div>
          )}
        </div>
        {!initRecording ? (
          <div className="text-gray-500 text-center mt-9 mb-3">
            Start a recording to anwser...
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center mt-3">
            <div className="flex items-center justify-center mt-9">
              <div className="recording-indicator"></div>
              <div className="text-gray-600 ml-3">Recoding in process: </div>
              <div className="ml-2">
                <span>{formatMinutes(recordingMinutes)}</span>
                <span>:</span>
                <span>{formatSeconds(recordingSeconds)}</span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={cancelRecording}
                className="border hover:bg-gray-200/20 hover:border-opacity-60  bg-white border-gray-300 border-opacity-60 text-gray-400 rounded px-3 py-2"
              >
                cancel recording
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
