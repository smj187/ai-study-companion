interface Props {
  fileName: string
  onClick: () => void
}

export const FilePreview: React.FC<Props> = ({ fileName, onClick }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center">{fileName}</div>
      <button
        onClick={onClick}
        className="inline-flex justify-center items-center py-3 px-5 rounded text-gray-500 border border-gray-200"
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
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <span className="pl-2">upload now</span>
      </button>
    </div>
  )
}
