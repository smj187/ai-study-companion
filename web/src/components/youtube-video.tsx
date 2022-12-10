import React, { useState } from "react"

interface Props {
  setYouTubeUrl: (value: React.SetStateAction<String | null>) => void
}

export const YouTubeVideo: React.FC<Props> = ({setYouTubeUrl}) => {
  const [v, setV] = useState("")

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setV(event.target.value)

    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = event.target.value.match(regExp)

    if (match && match[7].length === 11) {
      console.log(match[7])
      console.log(`'https://img.youtube.com/vi/${match[7]}/maxresdefault.jpg'`)
    }
    setYouTubeUrl(event.target.value)
    console.log(event.target.value)
  }
  return (
    <div className="w-full h-full flex flex-col space-y-3 justify-center items-center">
      <div className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="fill-red-600 w-12 h-12"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
        </svg>
        <span className="font-medium">YouTube Video Link</span>
      </div>
      <div className="w-full px-5">
        <input
          type="text"
          value={v}
          onChange={onChange}
          placeholder="https://www.youtube.com/watch?v=<video_id>"
          className="px-3 py-2 rounded outline-none w-full border border-gray-400 border-opacity-20"
        />
      </div>
    </div>
  )
}
