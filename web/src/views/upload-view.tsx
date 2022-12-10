import { useState } from "react"
import { FileUpload } from "../components/file-upload"
import { TextField } from "../components/text-field"
import { YouTubeVideo } from "../components/youtube-video"
import { useNavigate } from "react-router-dom"
import { InputForm } from "../components/input-form"
import { FileUpload2 } from "../components/file-upload-2"
import { YouTubeVideo2 } from "../components/youtube-video2"

const BASE_URL = "http://localhost:8000"

export const UploadView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [yt_url, setYouTubeUrl] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [questions, setQuestions] = useState<[string] | null>(null)
  const [answers, setAnswers] = useState<[string] | null>(null)

  let navigate = useNavigate()

  const onProcessing = async () => {
    setLoading(true)
    setResult(null)

    // TODO add youtube download

    if (file === null && yt_url === null) {
      throw new Error("file or url must not be null")
    }
    try {
      let assembly_response: any
      if (yt_url !== null){
        console.info("process youtube link...")
        console.info(yt_url)
        const url = (
          `${BASE_URL}/assembly/youtube?` +
          new URLSearchParams({ yt_url: yt_url}).toString()
        )
        const assembly_data = await fetch(url)
        assembly_response = await assembly_data.json()
      } else {
        const body = new FormData()
        body.append("file", file)
        
        console.info("upload file...")
        const assembly_data = await fetch(`${BASE_URL}/assembly`, {
          body,
          method: "POST"
        })
        assembly_response = await assembly_data.json()
      }
      
      console.info("generate questions...")
      console.log(assembly_response["chapters"][0]["summary"])
      const url =
        `${BASE_URL}/chatgpt?` +
        new URLSearchParams({
          input_text: assembly_response["chapters"][0]["summary"],
          generate_question: true
        }).toString()
      console.log(url)
      const chatgpt_data = await fetch(url)
      const chatgpt_response = await chatgpt_data.json()

      setResult(assembly_response["chapters"][0]["summary"])
      setQuestions([chatgpt_response["message"]])
      //setAnswers(chatgpt_response['message']) // todo generate answers
      setLoading(false)
    } catch (e) {
      console.error(e)
      // TODO alert: something went wrong, please try again...
    }
  }

  return (
    <div className="flex flex-col space-y-9 font-inter">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Upload Your Notes
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Upload your notes to lorem ipsum dolor sit amet, consetetur sadipscing
          elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
          magna aliquyam erat, sed diam voluptua.
        </p>
      </div>

      <div className="flex flex-col py-9 space-y-6">
        <div className="flex w-full space-x-6">
          <InputForm>
            <FileUpload2 />
          </InputForm>
          <InputForm>
            <YouTubeVideo2 setYouTubeUrl={setYouTubeUrl}/>
          </InputForm>
        </div>

        <div>
          <button className="bg-rose-500 hover:bg-rose-400 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={onProcessing}>
            {loading ? (
              <svg
                aria-hidden="true"
                role="status"
                className="inline mr-1 w-5 h-5 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M15.224 15.508l-2.213 4.65a.6.6 0 0 1-.977.155l-3.542-3.739a.6.6 0 0 0-.357-.182l-5.107-.668a.6.6 0 0 1-.449-.881l2.462-4.524a.6.6 0 0 0 .062-.396L4.16 4.86a.6.6 0 0 1 .7-.7l5.063.943a.6.6 0 0 0 .396-.062l4.524-2.462a.6.6 0 0 1 .881.45l.668 5.106a.6.6 0 0 0 .182.357l3.739 3.542a.6.6 0 0 1-.155.977l-4.65 2.213a.6.6 0 0 0-.284.284zm.797 1.927l1.414-1.414 4.243 4.242-1.415 1.415-4.242-4.243z" />
              </svg>
            )}
            <span className="ml-3">
              {loading ? "Processing..." : "Generate"}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-96 pt-96">
        <YouTubeVideo setYouTubeUrl={setYouTubeUrl} />
        <FileUpload setFile={setFile} />
        <button
          onClick={onProcessing}
          className="bg-rose-600 text-white rounded px-3 py-2"
        >
          Process
        </button>

        <div>{loading ? "loading" : ""}</div>

        <div>
          {questions && answers && (
            <div>
              {" "}
              <button
                onClick={navigate("/exam")}
                className="bg-rose-600 text-white rounded px-3 py-2"
              >
                Start learning
              </button>
            </div>
          )}
        </div>
        <div>{result && <div> Summary (1. Chapter): {result} </div>}</div>
        <div>
          {questions && <div> Question (1. Chapter): {questions[0]} </div>}
        </div>
      </div>
    </div>
  )
}
