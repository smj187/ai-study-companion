import React, { useState } from "react"

interface Props {
  setFileUrl: (value: React.SetStateAction<string | null>) => void
}

export const RemoteFile: React.FC<Props> = ({ setFileUrl }) => {
  const [v, setV] = useState("")

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setV(event.target.value)

    const regex =
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

    const match = event.target.value.match(regex)
    if (match) {
      setFileUrl(event.target.value)
    }
  }
  return (
    <div className="w-full h-full flex flex-col space-y-3 justify-center items-center">
      <div className="flex items-center space-x-2 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className=" w-10 h-10 fill-gray-500"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M14.997 2L21 8l.001 4.26A5.466 5.466 0 0 0 17.5 11l-.221.004a5.503 5.503 0 0 0-5.127 4.205l-.016.074-.03.02A4.75 4.75 0 0 0 10.878 22L3.993 22a.993.993 0 0 1-.986-.876L3 21.008V2.992c0-.498.387-.927.885-.985L4.002 2h10.995zM17.5 13a3.5 3.5 0 0 1 3.5 3.5l-.001.103a2.75 2.75 0 0 1-.581 5.392L20.25 22h-5.5l-.168-.005a2.75 2.75 0 0 1-.579-5.392L14 16.5a3.5 3.5 0 0 1 3.5-3.5z" />
        </svg>
        <span className="font-medium">Remote URL File</span>
      </div>
      <div className="w-full px-5">
        <input
          type="text"
          value={v}
          onChange={onChange}
          placeholder="https://example.com/my-file"
          className="px-3 py-2 rounded outline-none w-full border border-gray-400 border-opacity-20"
        />
      </div>
    </div>
  )
}
