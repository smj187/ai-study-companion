import { useEffect } from "react"

export const App: React.FC = () => {
  const load = async () => {
    const r = await fetch("http://localhost:8000")
    console.log(await r.json())
  }

  useEffect(() => {
    load()
  }, [])
  return <div className="bg-zinc-900 text-white">test</div>
}

