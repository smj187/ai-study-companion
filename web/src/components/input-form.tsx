interface Props {
  children: React.ReactNode
}

export const InputForm: React.FC<Props> = ({ children }) => {
  return (
    <div className="max-w-sm flex-grow w-full">
      <div className="flex justify-center items-center w-full h-40  transition border-2 border-gray-300 border-opacity-50 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 transform duration-200 ease-in-out hover:border-opacity-60 focus:outline-none">
        {children}
      </div>
    </div>
  )
}
