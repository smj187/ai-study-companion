import { AppQuestionModel } from "../types"
import { LearningCard } from "./learning-card"

interface Props {
  activeQuestion: AppQuestionModel | null
  decreaseIndex: () => void
  increaseIndex: () => void
}

export const Quiz: React.FC<Props> = ({
  activeQuestion,
  decreaseIndex,
  increaseIndex
}) => {
  return (
    <div>
      <LearningCard
        title="Quiz"
        activeQuestion={activeQuestion}
        decreaseIndex={decreaseIndex}
        increaseIndex={increaseIndex}
      />
    </div>
  )
}
