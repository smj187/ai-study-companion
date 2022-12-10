import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

interface Props {
  //
}

export const FileUpload2: React.FC<Props> = ({}) => {
  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const file = acceptedFiles[0]

    console.log(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop
  })

  return (
    <div {...getRootProps()} className="h-full w-full grid place-items-center">
      <label className="">
        <span className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="font-medium">
            Drop files, or
            <span className="text-blue-600 underline ml-1">browse</span>
          </span>
        </span>
      </label>
      <input type="file" multiple={false} {...getInputProps()} />
    </div>
  )
}