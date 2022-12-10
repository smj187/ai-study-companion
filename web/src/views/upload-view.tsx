import { useState } from "react"
import { FileUpload } from "../components/file-upload"

const BASE_URL = "http://localhost:8000"

export const UploadView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const onFileUpload = async () => {
    setLoading(true)
    setResult(null)

    if (file === null) {
      throw new Error("file must not be null")
    }
    const body = new FormData()
    body.append("file", file)

    const data = await fetch(`${BASE_URL}/assembly`, {
      body,
      method: "POST"
    })

    setResult(JSON.stringify(await data.json()))
    setLoading(false)
  }

  return (
    <div className="flex flex-col space-y-9">
      <FileUpload setFile={setFile} />
      <button
        onClick={onFileUpload}
        className="bg-rose-600 text-white rounded px-3 py-2"
      >
        upload file
      </button>
      <div>{loading ? "loading" : ""}</div>
      <div>{result && <div> {result} </div>}</div>
    </div>
  )
}
