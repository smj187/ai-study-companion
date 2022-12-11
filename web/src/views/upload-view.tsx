import { useEffect, useState } from "react"
import { FileUpload } from "../components/file-upload"
import { TextField } from "../components/text-field"
import { YouTubeVideo } from "../components/youtube-video"
import { useNavigate } from "react-router-dom"
import { InputForm } from "../components/input-form"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { AssemblyResponse } from "../types/assembly-types"

import Lottie from "lottie-react"
import upload from "../assets/upload.json"
import { RemoteFile } from "../components/remote-file"
import { FilePreview } from "../components/file-preview"
import { Loading } from "../components/loading"
import { RemotePreview } from "../components/remote-preview"
import { YouTubePreview } from "../components/youtube-preview"
import { ChatGPTResponse } from "../types/openai-types"
import { useAppContext } from "../context/app-context"

interface Questions {
  id: string
  question: string
  answer: null | string
  visibleAnswer: boolean
  voiceInputFile: File | null
  voiceInputUrl: string | null
}

const BASE_URL = "http://localhost:8000"

export const UploadView: React.FC = () => {
  // local file
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // remote file
  const [loadingRemote, setLoadingRemote] = useState(false)
  const [remote, setRemote] = useState<string | null>(null)

  // youtube
  const [loadingYouTube, setLoadingYouTube] = useState(false)

  // -> https://www.youtube.com/watch?v=6jA0xePC-pM
  const [youTubeVideoUrl, setYouTubeVideoUrl] = useState<string | null>(null)

  const [result, setResult] = useState<string | null>(null)
  const [answers, setAnswers] = useState<[string] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { appQuestions, addQuestion } = useAppContext()

  // const [questions, setQuestions] = useLocalStorage<Array<Questions>>(
  //   "questions",
  //   []
  // )

  let navigate = useNavigate()

  const generateQuestions = async (response: AssemblyResponse) => {
    console.info("generate questions...")

    for (let i = 0; i < response.chapters.length; i++) {
      const url_question =
        `${BASE_URL}/chatgpt?` +
        new URLSearchParams({
          input_text: response.chapters[i]["summary"],
          generate_question: `${true}`
        }).toString()

      const chatgpt_question_data = await fetch(url_question)
      const chatgpt_question: ChatGPTResponse =
        await chatgpt_question_data.json()
      console.log("chatgpt_question", chatgpt_question)

      const url_answer =
        `${BASE_URL}/chatgpt?` +
        new URLSearchParams({
          input_text: chatgpt_question["message"],
          generate_question: `${false}`
        }).toString()

      const chatgpt_answer_data = await fetch(url_answer)
      const chatgpt_answer: ChatGPTResponse = await chatgpt_answer_data.json()
      console.log("chatgpt_answer", chatgpt_answer)

      addQuestion(chatgpt_question.message, chatgpt_answer.message)
    }

    // console.log(response.chapters)

    // const chatgptUrls = response.chapters.map(chapter => {
    //   const cParams = new URLSearchParams()
    //   cParams.append("input_text", chapter.summary)
    //   cParams.append("generate_question", `${true}`)

    //   const cUrl = `${BASE_URL}/chatgpt?${cParams}`

    //   // console.log(u)
    //   return cUrl
    // })

    // // https://stackoverflow.com/a/67146861/18175280
    // const requests = chatgptUrls.map(u => fetch(u))
    // const responses = await Promise.all(requests)

    // const data: Array<ChatGPTResponse> = await Promise.all(
    //   responses.map(response => response.json())
    // )

    // console.log(data)
  }

  const onYouTubeUpload = async () => {
    setLoadingYouTube(true)
    setResult(null)

    if (youTubeVideoUrl === null) {
      setError("pls provide a youtube video url before continiuing")
      return
    }

    console.info("process youtube link...")
    console.info(youTubeVideoUrl)

    const params = new URLSearchParams()
    params.append("yt_url", youTubeVideoUrl)

    const url = `${BASE_URL}/assembly/youtube?${params}`

    const request = await fetch(url)

    const response: AssemblyResponse = await request.json()
    // console.log(response)

    setResult(response.chapters[0].summary)

    generateQuestions(response)

    setYouTubeVideoUrl(null)
    setLoadingYouTube(false)

    // throw new Error("e")

    // try {
    //   let assembly_response: AssemblyResponse

    //   if (youTubeVideoUrl !== null) {
    //     console.info("process youtube link...")
    //     console.info(youTubeVideoUrl)

    //     const params = new URLSearchParams()
    //     params.append("yt_url", youTubeVideoUrl)

    //     const u = `${BASE_URL}/assembly/youtube?${params}`
    //     console.log(u)

    //     const url =
    //       `${BASE_URL}/assembly/youtube?` +
    //       new URLSearchParams({ yt_url: youTubeVideoUrl }).toString()
    //     const assembly_data = await fetch(url)
    //     assembly_response = await assembly_data.json()
    //   } else {
    //     const body = new FormData()
    //     body.append("file", file)

    //     console.info("upload file...")
    //     const assembly_data = await fetch(`${BASE_URL}/assembly`, {
    //       body,
    //       method: "POST"
    //     })
    //     assembly_response = await assembly_data.json()
    //   }

    //   console.info("generate questions...")
    //   for (let i = 0; i < assembly_response["chapters"].length; i++) {
    //     const url_question =
    //       `${BASE_URL}/chatgpt?` +
    //       new URLSearchParams({
    //         input_text: assembly_response["chapters"][i]["summary"],
    //         generate_question: true
    //       }).toString()

    //     const chatgpt_question_data = await fetch(url_question)
    //     const chatgpt_question = await chatgpt_question_data.json()

    //     const url_answer =
    //       `${BASE_URL}/chatgpt?` +
    //       new URLSearchParams({
    //         input_text: chatgpt_question["message"],
    //         generate_question: false
    //       }).toString()

    //     const chatgpt_answer_data = await fetch(url_answer)
    //     const chatgpt_answer = await chatgpt_answer_data.json()

    //     questions.push({
    //       id: i.toString(),
    //       question: chatgpt_question["message"],
    //       answer: chatgpt_answer["message"],
    //       visibleAnswer: false,
    //       voiceInputFile: null,
    //       voiceInputUrl: null
    //     })
    //   }

    //   setResult(assembly_response["chapters"][0]["summary"])
    //   setLoadingYouTube(false)
    // } catch (e) {
    //   console.error(e)
    //   // TODO alert: something went wrong, please try again...
    // }
  }

  const onRemoteFileUpload = async () => {
    setLoadingRemote(true)
    if (remote === null) {
      setError("pls provide a remote url before continiuing")
      return
    }

    const body = JSON.stringify({
      remote_audio_url: remote
    })

    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const request = await fetch(`${BASE_URL}/assembly/remote`, {
      method: "POST",
      body,
      headers
    })

    const response: AssemblyResponse = await request.json()

    // TODO: do something?
    console.log(response)

    setResult(response.chapters[0].summary)

    generateQuestions(response)

    setRemote(null)
    setLoadingRemote(false)
  }

  const onLocalFileUpload = async () => {
    setLoading(true)
    if (file === null) {
      setError("pls provide a file before continiuing")
      return
    }
    const body = new FormData()
    body.append("file", file)

    const request = await fetch(`${BASE_URL}/assembly/file`, {
      method: "POST",
      body
    })

    const response: AssemblyResponse = await request.json()

    // TODO: do something?
    console.log(response)

    setResult(response.chapters[0].summary)

    generateQuestions(response)

    setLoading(false)
    setFile(null)
  }

  useEffect(() => {
    console.log(youTubeVideoUrl)
  }, [youTubeVideoUrl])

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

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <span className="font-medium">An error occurred:</span> {error}
        </div>
      )}

      <div className="flex flex-col ">
        <div className="grid grid-cols-3 gap-6">
          <InputForm title="From Local File" withPointer={file === null}>
            {file === null && <FileUpload setFile={setFile} />}
            {file !== null && loading === false && (
              <FilePreview fileName={file.name} onClick={onLocalFileUpload} />
            )}
            {loading && <Loading />}
          </InputForm>

          <InputForm title="From YouTube Video" withPointer={false}>
            {youTubeVideoUrl === null && (
              <YouTubeVideo setYouTubeUrl={setYouTubeVideoUrl} />
            )}
            {youTubeVideoUrl !== null && loadingYouTube === false && (
              <YouTubePreview onClick={onYouTubeUpload} />
            )}
            {loadingYouTube && <Loading />}
          </InputForm>

          <InputForm title="From Remote File" withPointer={false}>
            {remote === null && <RemoteFile setFileUrl={setRemote} />}
            {remote !== null && loadingRemote === false && (
              <RemotePreview onClick={onRemoteFileUpload} />
            )}

            {loadingRemote && <Loading />}
          </InputForm>
        </div>

        <div>{result && <div> Summary (1. Chapter): {result} </div>}</div>

        <div className="relative flex flex-col w-full h-[500px] overflow-y-auto bg-white rounded-md py-3 mt-32">
          {appQuestions.map(q => {
            return (
              <div className="w-full flex" key={q.id}>
                <span className="font-bold text-rose-500 pr-3 w-full flex-1  text-right">
                  {q.question}
                </span>
                <span className="text-slate-500 w-full flex-1">
                  {q.chatGptAnswer}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
