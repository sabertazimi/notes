export default function canConstruct(
  ransomNote: string,
  magazine: string,
): boolean {
  for (let i = 0; i < ransomNote.length; i++) {
    if (!magazine.includes(ransomNote[i]))
      return false
    magazine = magazine.replace(ransomNote[i], '')
  }

  return true
}
