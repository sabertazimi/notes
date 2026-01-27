class TreeNode<T> {
  val: T
  left: TreeNode<T> | null
  right: TreeNode<T> | null

  constructor(val: T) {
    this.val = val
    this.left = null
    this.right = null
  }
}

/**
 * @param nodes Tree node array (include the `null` node)
 * @returns Root of binary tree
 */
function arrayToTree<T>(nodes: (T | null)[]): TreeNode<T> | null {
  if (nodes.length === 0)
    return null

  let nextItem = 0
  const root = new TreeNode(nodes[nextItem++] as T)
  const queue = [root]

  while (queue.length > 0) {
    const current = queue.shift() as TreeNode<T>

    if (nextItem < nodes.length) {
      const item = nodes[nextItem++]

      if (item !== null) {
        const node = new TreeNode(item)
        current.left = node
        queue.push(node)
      }
    }

    if (nextItem < nodes.length) {
      const item = nodes[nextItem++]

      if (item !== null) {
        const node = new TreeNode(item)
        current.right = node
        queue.push(node)
      }
    }
  }

  return root
}

type Order = 'pre' | 'in' | 'post'

function traversal<T>(root: TreeNode<T> | null, visitor: (node: T) => void, order: Order = 'in'): void {
  if (root === null)
    return

  switch (order) {
    case 'pre':
      visitor(root.val)
      traversal(root.left, visitor, order)
      traversal(root.right, visitor, order)
      break
    case 'in':
      traversal(root.left, visitor, order)
      visitor(root.val)
      traversal(root.right, visitor, order)
      break
    case 'post':
      traversal(root.left, visitor, order)
      traversal(root.right, visitor, order)
      visitor(root.val)
      break
  }
}

class SegmentTree<T> {
  private readonly data: T[]
  private readonly tree: T[]
  private readonly fn: (left: T, right: T) => T
  private readonly init: T

  constructor(data: T[], fn: (left: T, right: T) => T, init: T) {
    if (data.length === 0)
      throw new Error('Data is empty')
    this.data = data
    this.fn = fn
    this.init = init
    this.tree = Array.from<T>({ length: data.length * 4 }).fill(init)
    this.build(0, 0, data.length - 1)
  }

  public get(index: number): T {
    return this.tree[this.getIndex(0, 0, this.data.length - 1, index)]
  }

  public set(index: number, value: T): void {
    this.update(index, value)
  }

  public query(left: number, right: number): T {
    return this.queryHelper(0, 0, this.data.length - 1, left, right)
  }

  private build(treeIndex: number, left: number, right: number): void {
    if (left === right) {
      this.tree[treeIndex] = this.data[left]
      return
    }

    const mid = left + ((right - left) >> 1)
    this.build(treeIndex * 2 + 1, left, mid)
    this.build(treeIndex * 2 + 2, mid + 1, right)
    this.tree[treeIndex] = this.fn(
      this.tree[treeIndex * 2 + 1],
      this.tree[treeIndex * 2 + 2],
    )
  }

  private getIndex(
    treeIndex: number,
    left: number,
    right: number,
    index: number,
  ): number {
    if (left === right)
      return treeIndex
    const mid = left + ((right - left) >> 1)
    if (index <= mid)
      return this.getIndex(treeIndex * 2 + 1, left, mid, index)
    else return this.getIndex(treeIndex * 2 + 2, mid + 1, right, index)
  }

  private update(index: number, value: T): void {
    this.updateHelper(0, 0, this.data.length - 1, index, value)
  }

  private updateHelper(
    treeIndex: number,
    left: number,
    right: number,
    index: number,
    value: T,
  ): void {
    if (left === right) {
      this.tree[treeIndex] = value
      return
    }

    const mid = left + ((right - left) >> 1)
    if (index <= mid)
      this.updateHelper(treeIndex * 2 + 1, left, mid, index, value)
    else this.updateHelper(treeIndex * 2 + 2, mid + 1, right, index, value)
    this.tree[treeIndex] = this.fn(
      this.tree[treeIndex * 2 + 1],
      this.tree[treeIndex * 2 + 2],
    )
  }

  private queryHelper(
    treeIndex: number,
    left: number,
    right: number,
    queryLeft: number,
    queryRight: number,
  ): T {
    if (queryLeft <= left && right <= queryRight)
      return this.tree[treeIndex]
    if (queryRight < left || right < queryLeft)
      return this.init
    const mid = left + ((right - left) >> 1)
    const leftResult = this.queryHelper(
      treeIndex * 2 + 1,
      left,
      mid,
      queryLeft,
      queryRight,
    )
    const rightResult = this.queryHelper(
      treeIndex * 2 + 2,
      mid + 1,
      right,
      queryLeft,
      queryRight,
    )
    return this.fn(leftResult, rightResult)
  }
}

export { arrayToTree, SegmentTree, traversal, TreeNode }
