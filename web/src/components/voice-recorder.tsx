import { useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { useVoiceRecorder } from "use-voice-recorder"
import WaveSurfer from "wavesurfer.js"
import { useAppContext } from "../context/app-context"
import "./wave.css"

interface Props {}

export const VoiceRecorder: React.FC<Props> = () => {
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null)
  const [audioFileUrl, setAudioFileUrl] = useState<string | null>(null)
  const { isRecording, stop, start, recorder } = useVoiceRecorder(data => {
    setAudioFileUrl(window.URL.createObjectURL(data))
  })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioListRef = useRef<HTMLDivElement | null>(null)
  const [reset, setReset] = useState(false)

  const { addUserAnswer, currentlyActiveQuestionId } = useAppContext()

  useEffect(() => {
    if (audioFileUrl !== null) {
      // console.log("audioFileUrl changed", audioFileUrl)

      if (audioListRef.current === null) throw new Error("audioListRef is null")
      if (audioRef.current === null) throw new Error("audioRef is null")

      if (reset === true) {
        setReset(false)
        return
      }

      audioRef.current.src = audioFileUrl

      const playback = document.createElement("div")
      playback.setAttribute("class", "block flex items-center space-x-3")

      //   const playbackBtn = document.createElement("button")
      //   playbackBtn.innerHTML = "PLAY"
      //   playbackBtn.setAttribute(
      //     "class",
      //     "bg-slate-400 hover:bg-slate-500 text-white rounded-md px-3 py-2  w-20 h-10 grid place-content-center"
      //   )

      const audioWave = document.createElement("div")
      audioWave.setAttribute("class", "audioWave")

      const waveSurfer = WaveSurfer.create({
        container: audioWave,
        backend: "MediaElement",
        responsive: true,
        backgroundColor: "transparent",
        progressColor: "#e11d48",
        waveColor: "#94a3b8",
        cursorColor: "#94a3b8"
      })
      setWaveSurfer(waveSurfer)

      //attach children to playbackAudio
      //   playback.appendChild(playbackBtn)
      playback.appendChild(audioWave)

      audioListRef.current.appendChild(playback)
      waveSurfer.load(audioFileUrl)

      waveSurfer.on("finish", () => {
        setWaveSurferState("Play")
      })

      //   playbackBtn.addEventListener("click", () => {
      //     if (waveSurfer.isPlaying()) {
      //       playbackBtn.innerText = "RESUME"
      //       waveSurfer.pause()
      //     } else {
      //       playbackBtn.innerText = "PAUSE"
      //       waveSurfer.play()
      //     }
      //   })
    }

    // remove wavesurfer instance
    return () => {
      waveSurfer?.destroy()

      if (audioListRef.current === null) return
      if (audioRef.current === null) return

      audioListRef.current.childNodes.forEach(child => child.remove())
    }
  }, [audioFileUrl])

  const [waveSurferState, setWaveSurferState] = useState("Replay Audio")

  const onStartStopWaveSurfer = () => {
    if (waveSurfer === null) {
      throw new Error("wavesurfer obj is null")
    }

    if (waveSurfer.isPlaying()) {
      waveSurfer.pause()
      setWaveSurferState("Replay Audio")
    } else {
      setWaveSurferState("Pause Audio")
      waveSurfer.play()
    }
  }

  const onReset = () => {
    setReset(true)
    setAudioFileUrl(null)
    stop()

    setWaveSurfer(null)
    waveSurfer?.destroy()

    if (audioListRef.current === null) throw new Error("audioListRef is null")
    if (audioRef.current === null) throw new Error("audioRef is null")

    audioListRef.current.childNodes.forEach(child => child.remove())
    audioRef.current.remove()
  }

  const onCheckAnser = () => {
    console.log("local file -> ", audioFileUrl)

    // TODO: https://www.assemblyai.com/docs/walkthroughs#getting-the-transcription-result
    // transcription

    addUserAnswer(
      currentlyActiveQuestionId!,
      "TODO: handle assembly AI stuff here"
    )

    console.log("TODO: handle assembly AI stuff here")
  }

  return (
    <div className="mb-96">
      <div>
        {currentlyActiveQuestionId}
        {/* record button */}
        <div className="m-9 bg-white rounded relative p-3 flex w-full max-w-md justify-between mx-auto">
          <div className="h-12 w-12">
            {isRecording && (
              <button
                onClick={onReset}
                className="bg-white rounded-md w-full h-full grid place-content-center cursor-pointer shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-rose-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {isRecording ? (
              <button
                onClick={stop}
                className="w-28 h-28 shadow-md bg-rose-600 text-white rounded-full cursor-pointer grid place-content-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={start}
                className="w-28 h-28 shadow-md bg-white rounded-full cursor-pointer grid place-content-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="h-12 w-12">
            {isRecording && (
              <div className="bg-white rounded-md w-full h-full grid place-content-center cursor-pointer shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-green-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* placeholder to the waveform */}
        <div>
          <div ref={audioListRef}></div>
          <audio ref={audioRef} className="hidden" controls></audio>
        </div>

        {waveSurfer === null && (
          <div className="h-[70px] text-center text-sm text-slate-400 flex items-center justify-center">
            <span className="pr-1">Start answering by pressing the</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
              />
            </svg>
            <span className="pl-1">button</span>
          </div>
        )}

        {/* replay waveform button and process with assembly ai button */}
        {waveSurfer !== null && (
          <div className="mt-3 flex justify-center items-center space-x-6">
            <button
              onClick={onStartStopWaveSurfer}
              className="bg-slate-400 hover:bg-slate-500 text-white rounded-md py-3 w-48 px-3 inline-flex items-center justify-center"
            >
              {waveSurferState === "Pause Audio" ? (
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
                    d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                  />
                </svg>
              ) : (
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
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                  />
                </svg>
              )}

              <span className="text-sm uppercase pl-2">{waveSurferState}</span>
            </button>

            <button
              onClick={onCheckAnser}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-md px-3 py-3 w-44 inline-flex items-center justify-center"
            >
              <span className="text-sm uppercase pr-2">check answer</span>

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
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
