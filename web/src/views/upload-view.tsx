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
import Q_and_A from "../assets/Q_and_A.json"
import { RemoteFile } from "../components/remote-file"
import { FilePreview } from "../components/file-preview"
import { Loading } from "../components/loading"
import { RemotePreview } from "../components/remote-preview"
import { YouTubePreview } from "../components/youtube-preview"
import { ChatGPTResponse } from "../types/openai-types"
import { useAppContext } from "../context/app-context"
import { useStore } from "../store/store"
import { Generating } from "../components/generating"

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
  const store = useStore()

  // local file
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [generateLocalQuestions, setGenerateLocalQuestions] = useState(false)

  // remote file
  const [loadingRemote, setLoadingRemote] = useState(false)
  const [remote, setRemote] = useState<string | null>(null)
  const [generateRemoteQuestions, setQenerateRemoteQuestions] = useState(false)

  // youtube
  const [loadingYouTube, setLoadingYouTube] = useState(false)
  const [generateYouTubeQuestions, setGenerateYouTubeQuestions] =
    useState(false)

  // -> https://www.youtube.com/watch?v=6jA0xePC-pM
  const [youTubeVideoUrl, setYouTubeVideoUrl] = useState<string | null>(null)

  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [loadingQuestions, setLoadingQuestions] = useState(false)

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

      // addQuestion(
      //   chatgpt_question.message,
      //   response.chapters[i]["summary"],
      //   chatgpt_answer.message
      // )

      store.addQuestion(
        chatgpt_question.message,
        response.chapters[i]["summary"],
        chatgpt_answer.message
      )
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

    setResult(response.chapters[0].summary)

    setGenerateYouTubeQuestions(true)
    await generateQuestions(response)
    setGenerateYouTubeQuestions(false)

    setYouTubeVideoUrl(null)
    setLoadingYouTube(false)
  }

  const onRemoteFileUpload = async () => {
    setLoadingRemote(true)
    setResult(null)
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

    setQenerateRemoteQuestions(true)
    await generateQuestions(response)
    setQenerateRemoteQuestions(false)

    setRemote(null)
    setLoadingRemote(false)
  }

  const onLocalFileUpload = async () => {
    setLoading(true)
    setResult(null)
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

    setGenerateLocalQuestions(true)
    await generateQuestions(response)
    setGenerateLocalQuestions(false)

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
          Upload Media
        </h3>
        <p className="mt-2 max-w-4xl text-gray-500">
          Professor.ai analyses the provided video and automatically extracts
          important and interesting questions. Of course this also includes the
          correct answer to them!
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
            {generateLocalQuestions === false && file === null && (
              <FileUpload setFile={setFile} />
            )}
            {file !== null && loading === false && (
              <FilePreview fileName={file.name} onClick={onLocalFileUpload} />
            )}
            {loading && generateLocalQuestions === false && (
              <Loading text="Process Local File..." />
            )}

            {generateLocalQuestions && <Generating />}
          </InputForm>

          <InputForm title="From YouTube Video" withPointer={false}>
            {generateYouTubeQuestions === false && youTubeVideoUrl === null && (
              <YouTubeVideo setYouTubeUrl={setYouTubeVideoUrl} />
            )}
            {youTubeVideoUrl !== null && loadingYouTube === false && (
              <YouTubePreview onClick={onYouTubeUpload} />
            )}

            {loadingYouTube && generateYouTubeQuestions === false && (
              <Loading text="Process Remote File..." />
            )}

            {generateYouTubeQuestions && <Generating />}
          </InputForm>

          <InputForm title="From Remote File" withPointer={false}>
            {generateRemoteQuestions === false && remote === null && (
              <RemoteFile setFileUrl={setRemote} />
            )}
            {remote !== null && loadingRemote === false && (
              <RemotePreview onClick={onRemoteFileUpload} />
            )}

            {loadingRemote && generateRemoteQuestions == false && (
              <Loading text="Process Remote File..." />
            )}

            {generateRemoteQuestions && <Generating />}
          </InputForm>
        </div>

        <div className="text-center pt-16">
          {result && !generateYouTubeQuestions && (
            <div className="text-slate-600">
              Head over to the learning tab or add another resource!
            </div>
          )}
        </div>

        <div className="relative flex flex-col w-full min-h-[500px] overflow-y-auto space-y-3 py-3 mt-16 mb-44">
          {store.questions.map(q => {
            return (
              <div
                key={q.id}
                className="w-full grid grid-cols-questions p-6 border-b border-slate-300/30 bg-white rounded-md"
              >
                <div className="text-rose-600 font-bold">Question</div>
                <div>{q.question}</div>

                <div className="text-slate-600 mt-3">Suggested Answer</div>
                <div className="text-slate-600 mt-3">{q.chatGptAnswer}</div>

                <div className="text-rose-600 font-bold mt-3">My Answer</div>
                <div className="text-slate-600 mt-3">
                  {q.userAnswer === null ? (
                    <span className="text-slate-400 italic">
                      not answered yet
                    </span>
                  ) : (
                    <>
                      <span>{q.userAnswer}</span>
                      <span className="text-slate-400 pl-1">
                        {q.answerIsCorrect
                          ? "(this answer is correct)"
                          : "(this answer is not correct)"}
                      </span>
                    </>
                  )}
                </div>

                <div className="col-span-2 mt-3 flex justify-end space-x-3">
                  {q.userAnswer !== null && (
                    <button
                      onClick={() => store.removeUserAnswer(q.id)}
                      className="group hover:bg-slate-50 hover:border-slate-50 hover:text-slate-600 border-slate-200/200 border cursor-pointer hover:border-opacity-30 rounded h-10 inline-flex text-slate-400 text-sm uppercase items-center w-[240px] justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                        />
                      </svg>

                      <span className="pl-2">remove my answer</span>
                    </button>
                  )}
                  <button
                    onClick={() => store.removeQuestion(q.id)}
                    className="group hover:bg-slate-50 hover:border-slate-50 hover:text-slate-600 border-slate-200/200 border cursor-pointer hover:border-opacity-30 rounded h-10 inline-flex text-slate-400 text-sm uppercase items-center w-[240px] justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="pl-1">remove this question</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
