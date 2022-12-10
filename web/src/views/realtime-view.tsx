import { useState, useEffect } from "react"

export const RealtimeView: React.FC = () => {
  const [result, setResult] = useState<string | null>(null)

  const socket = new WebSocket('ws://localhost:8000/listen') // TODO should only be called once?

  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    if (!MediaRecorder.isTypeSupported('audio/webm'))
        return alert('Browser not supported')

    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
    })

    socket.onopen = () => {
        console.log({ event: 'onopen' })
        mediaRecorder.addEventListener('dataavailable', async (event) => {
            if (event.data.size > 0 && socket.readyState == 1) {
                socket.send(event.data)
            }
        })
      mediaRecorder.start(250)
    }

    socket.onmessage = (message) => {
        const received = message.data
        if (received) {
            console.log(received)
            setResult(received)
        }
    }

    socket.onclose = () => {
      console.log({ event: 'onclose' })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    }

    socket.onerror = (error) => {
        console.log({ event: 'onerror', error })
    }

  })

  return (
    <div>
    {result && <div> {result} </div>}
    </div>
  )
}
