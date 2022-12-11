import Lottie from "lottie-react"
import upload from "../assets/upload.json"
import Q_and_A from "../assets/Q_and_A.json"

export const Generating = () => {
  return (
    <div>
      <Lottie className="h-24" animationData={Q_and_A} loop={true} />
      <span className="text-slate-600">
        Generating questions and answers...
      </span>
    </div>
  )
}
