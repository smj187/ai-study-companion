import { NavLink } from "react-router-dom"

export const Header = () => {
  return (
    <header className="fixed w-full h-16 border-b border-gray-400/30 px-3 flex items-center justify-center space-x-3">
      <NavLink to="/" className="hover:bg-gray-200/50 rounded px-3 py-2">
        App
      </NavLink>
      <NavLink to="/upload" className="hover:bg-gray-200/50 rounded px-3 py-2">
        Upload
      </NavLink>
    </header>
  )
}
