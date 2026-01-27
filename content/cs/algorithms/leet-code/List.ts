import consola from 'consola'

class ListNode<T> {
  val: T
  next: ListNode<T> | null

  constructor(val: T, next?: ListNode<T> | null) {
    this.val = val
    this.next = next === undefined ? null : next
  }
}

function arrayToList<T>(nodes: T[]): ListNode<T> | null {
  if (nodes.length === 0)
    return null

  let list = new ListNode(nodes[nodes.length - 1])

  for (let i = nodes.length - 2; i >= 0; i--) {
    const current = new ListNode(nodes[i], list)
    list = current
  }

  return list
}

function printList<T>(list: ListNode<T> | null): void {
  let output = ''

  for (let node = list; node !== null; node = node.next) {
    output += `[${String(node.val)}]`

    if (node.next !== null)
      output += ' -> '
  }

  consola.info(output)
}

export { arrayToList, ListNode, printList }
