import Lottie from "lottie-react"
import gears from "../assets/gears.json"

export const Loading: React.FC = () => {
  return (
    <div className="relative w-full">
      <Lottie className="h-56 -mt-16" animationData={gears} loop={true} />
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-gray-500">
        File is being processed...
      </span>
    </div>
  )
}
