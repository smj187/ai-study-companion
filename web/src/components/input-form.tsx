import { twMerge } from "tailwind-merge"

interface Props {
  children: React.ReactNode
  title?: string | null
  withPointer?: boolean
}

export const InputForm: React.FC<Props> = ({
  children,
  title = null,
  withPointer = true
}) => {
  return (
    <div className="max-w-md flex-grow w-full">
      <div
        className={twMerge(
          "relative flex justify-center items-center w-full h-48 bg-white   transition rounded-md appearance-none  hover:border-gray-400 transform duration-200 ease-in-out hover:border-opacity-60 focus:outline-none",
          withPointer && "cursor-pointer"
        )}
      >
        {children}
        {title !== null && (
          <span className="text-sm text-slate-400 absolute top-2 left-4 cursor-default">
            {title}
          </span>
        )}
      </div>
    </div>
  )
}
