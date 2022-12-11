import { useState } from "react"
import { useAppContext } from "../context/app-context"
import { twMerge } from "tailwind-merge"
import { Recorder } from "vmsg"
import { VoiceRecorder } from "../components/voice-recorder"
import { Quiz } from "../components/quiz"

export const AppView: React.FC = () => {
  return (
    <div className="font-inter ">
      <Quiz />
      <VoiceRecorder />
    </div>
  )
}
