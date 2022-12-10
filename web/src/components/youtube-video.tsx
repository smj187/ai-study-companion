import React, { useState } from "react"

export const YouTubeVideo = () => {
  const [url, setUrl] = useState("")
  const [valid, setValid] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)

    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = e.target.value.match(regex)
    if (match !== null) {
      console.log(match[1])
      setValid(true)
    } else {
      setValid(false)
    }
  }

  return (
    <div className="max-w-md flex-grow w-full ">
      <label className="flex justify-center w-full h-44 px-4 transition border-2 border-zinc-300/30 border-dashed rounded-md appearance-none cursor-pointer hover:border-zinc-400 hover:border-opacity-80 focus:outline-none">
        <div className="flex items-center justify-center space-y-2 flex-col w-full">
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
            <span className="font-medium text-zinc-300">
              YouTube Video Link
            </span>
          </div>
          <input
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=<video_id>"
            className="bg-zinc-800 px-3 py-2 rounded outline-none w-full max-w-sm placeholder:text-zinc-500"
          />
          <div className=" h-10">
            {valid ? (
              <div className="flex items-center justify-center space-x-2 ">
                <svg
                  aria-hidden="true"
                  className="mr-2 w-7 h-7 text-zinc-600 animate-spin  fill-rose-400"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="text-zinc-300 text-sm">Loading Video...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 mt-3">
                <span className="text-zinc-400 italic text-sm">No video</span>
              </div>
            )}
          </div>
        </div>
      </label>
    </div>
  )
}