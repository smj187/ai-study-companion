import { useState } from "react"
import { FileUpload } from "../components/file-upload"
import { TextField } from "../components/text-field"
import { YouTubeVideo } from "../components/youtube-video"
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000"

export const UploadView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [yt_url, setYouTubeUrl] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [questions, setQuestions] = useState<[string] | null>(null)
  const [answers, setAnswers] = useState<[string] | null>(null)

  let navigate = useNavigate()

  const onProcessing= async () => {
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
          new URLSearchParams({ "yt_url": yt_url}).toString()
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
      let summary: string = assembly_response['chapters'][0]['summary']
      console.log(summary)
      const url = (
        `${BASE_URL}/chatgpt?` +
        new URLSearchParams({ "input_text": summary,
                              "generate_question": true }).toString()
      )
      const chatgpt_data = await fetch(url)
      const chatgpt_response = await chatgpt_data.json()

      setResult(assembly_response['chapters'][0]['summary'])
      setQuestions([chatgpt_response['message']])
      //setAnswers(chatgpt_response['message']) // todo generate answers
      setLoading(false)
    } catch (e) {
        console.error(e)
        // TODO alert: something went wrong, please try again...
    }
  }

  return (
    <div className="flex flex-col space-y-9">
      <YouTubeVideo setYouTubeUrl={setYouTubeUrl}/> 
      <FileUpload setFile={setFile}/>
      <button
        onClick={onProcessing}
        className="bg-rose-600 text-white rounded px-3 py-2">
        Process
      </button>

      <div>{loading ? "loading" : ""}</div>

      <div>{questions && answers && <div> <button
        onClick={navigate("/exam")}
        className="bg-rose-600 text-white rounded px-3 py-2">
        Start learning
      </button></div>}</div>
      <div>{result && <div> Summary (1. Chapter): {result} </div>}</div>
      <div>{questions && <div> Question (1. Chapter): {questions[0]} </div>}</div>
    </div>
  )
}
