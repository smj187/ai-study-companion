import { useState } from "react"

export const AppView: React.FC = () => {
  const [selected, setSelected] = useState("Learning")
  return (
    <div className="font-inter">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <a
              onClick={() => setSelected("Learning")}
              href="#"
              className={
                selected === "Learning"
                  ? "inline-block p-4 text-rose-600 rounded-t-lg border-b-2 border-rose-600 active"
                  : "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
              }
            >
              Learning
            </a>
          </li>
          <li className="mr-2">
            <a
              onClick={() => setSelected("My Files")}
              href="#"
              className={
                selected === "My Files"
                  ? "inline-block p-4 text-rose-600 rounded-t-lg border-b-2 border-rose-600 active"
                  : "inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300"
              }
              aria-current="page"
            >
              My Files
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
