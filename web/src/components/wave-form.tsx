import { useEffect, useRef, useState } from "react"
import WaveSurfer from "wavesurfer.js"
import "./wave.css"

interface Props {
  fileUrl: string | null
}

export const WaveForm: React.FC<Props> = ({ fileUrl = null }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioListRef = useRef<HTMLDivElement | null>(null)
  const [render, setRender] = useState(0)

  useEffect(() => {
    if (fileUrl !== null) {
      if (audioListRef.current === null) {
        throw new Error("audioListRef is null")
      }
      if (audioRef.current === null) {
        throw new Error("audioRef is null")
      }
      console.log("create--", fileUrl)

      audioRef.current.src = fileUrl

      const playback = document.createElement("div")
      playback.setAttribute("class", "block flex items-center space-x-3")

      const playbackBtn = document.createElement("button")
      playbackBtn.innerText = "Play"
      playbackBtn.setAttribute(
        "class",
        "w-20 h-10 float-left font-inter bg-rose-600 hover:bg-rose-400 text-white px-3 py-2 uppercase textm-sm rounded"
      )

      const audioWave = document.createElement("div")
      audioWave.setAttribute("class", "audioWave")
      const wavesurfer = WaveSurfer.create({
        container: audioWave,
        backend: "MediaElement",
        responsive: true,
        backgroundColor: "#ffffff",
        progressColor: "#ef4444",
        waveColor: "#d4d4d8"
      })

      //attach children to playbackAudio
      playback.appendChild(playbackBtn)
      playback.appendChild(audioWave)

      audioListRef.current.appendChild(playback)
      wavesurfer.load(fileUrl)

      wavesurfer.on("finish", () => {
        playbackBtn.innerText = "Play"
      })

      playbackBtn.addEventListener("click", () => {
        if (wavesurfer.isPlaying()) {
          playbackBtn.innerText = "Start"
          wavesurfer.pause()
        } else {
          playbackBtn.innerText = "Stop"
          wavesurfer.play()
        }
      })

      setRender(render + 1)
    }
  }, [fileUrl])

  return (
    <div>
      <div ref={audioListRef}></div>
      <audio ref={audioRef} className="hidden" controls></audio>
    </div>
  )
}
