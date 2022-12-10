import { nanoid } from "nanoid"

export const getYouTubeThumbnail = (url: string): string | null => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[7].length === 11) {
    console.log(match[7])
    return "https://img.youtube.com/vi/${match[7]}/maxresdefault.jpg"
  }

  return null
}

export const generateKey = () => {
  return nanoid()
}

export const formatMinutes = (minutes: number) => {
  return minutes < 10 ? `0${minutes}` : `${minutes}`
}

export const formatSeconds = (seconds: number) => {
  return seconds < 10 ? `0${seconds}` : `${seconds}`
}
