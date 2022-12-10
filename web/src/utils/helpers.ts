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
