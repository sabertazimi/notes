export default function countSegments(s: string): number {
  return s.split(' ').filter(Boolean).length
}
