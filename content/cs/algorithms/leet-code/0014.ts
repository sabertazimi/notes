export default function longestCommonPrefix(stringArray: string[]): string {
  const firstString = stringArray[0]

  for (let len = 0; stringArray.length > 0; len++) {
    for (let i = 0; i < stringArray.length; i++) {
      const str = stringArray[i]

      if (str.length <= len || firstString[len] !== str[len])
        return str.slice(0, len)
    }
  }

  return ''
}
