import Link from '@docusaurus/Link'
import { Badge } from '@site/src/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@site/src/components/ui/card'
import { MagicCard } from '@site/src/components/ui/magic-card'
import { ScrollVelocityContainer, ScrollVelocityRow } from '@site/src/components/ui/scroll-based-velocity'
import { cn } from '@site/src/lib/utils'

interface Note {
  title: string
  category: string
  href: string
}

const DefaultNotes: Note[][] = [
  // Row 1: AI & Machine Learning
  [
    { title: 'Neural Architectures', category: 'AI', href: '/ai/theory/neural-architectures' },
    { title: 'Prompt Engineering', category: 'LLM', href: '/ai/llm/prompt-engineering' },
    { title: 'Claude Code', category: 'Agent', href: '/ai/llm/claude-code' },
    { title: 'Transformer', category: 'AI', href: '/ai/theory/transformers' },
    { title: 'RAG System', category: 'LLM', href: '/ai/llm/rag' },
  ],
  // Row 2: Systems & Algorithms
  [
    { title: 'Graph Algorithms', category: 'Algorithms', href: '/cs/algorithms/graph' },
    { title: 'Process Management', category: 'OS', href: '/cs/os/process' },
    { title: 'Dynamic Programming', category: 'Algorithms', href: '/cs/algorithms/dp' },
    { title: 'Garbage Collection', category: 'Compilers', href: '/cs/compilers/gc' },
    { title: 'SQL Indexing', category: 'Database', href: '/cs/database/indexing' },
  ],
  // Row 3: Frontend & Modern Web
  [
    { title: 'Animation', category: 'CSS', href: '/web/css/animation' },
    { title: 'State Hooks', category: 'React', href: '/web/react/hooks/state' },
    { title: 'Async JavaScript', category: 'JavaScript', href: '/web/javascript/async' },
    { title: 'Generics', category: 'TypeScript', href: '/web/typescript/generic' },
    { title: 'HTTP Protocol', category: 'Network', href: '/web/network/http' },
  ],
  // Row 4: Programming Languages
  [
    { title: 'Template', category: 'C++', href: '/language/cpp/template' },
    { title: 'Monads', category: 'Haskell', href: '/language/haskell/monad' },
    { title: 'Concurrency', category: 'Java', href: '/language/java/concurrency' },
    { title: 'Ownership', category: 'Rust', href: '/language/rust/ownership' },
    { title: 'State Machine', category: 'Verilog', href: '/language/verilog/state-machine' },
  ],
  // Row 5: Development Practices
  [
    { title: 'SOLID Principle', category: 'Design', href: '/programming/design/solid' },
    { title: 'Shell Scripts', category: 'Linux', href: '/programming/linux/shell' },
    { title: 'Internals', category: 'Git', href: '/programming/git/internals' },
    { title: 'Neovim', category: 'Vim', href: '/programming/vim/toolchain' },
    { title: 'Docker & K8s', category: 'DevOps', href: '/programming/devops/docker' },
  ],
]

function NoteCard({ note, className }: { note: Note, className?: string }) {
  return (
    <Link to={note.href} className={cn('block no-underline!', className)}>
      <Card className="group w-56 h-full truncate border-none p-0 shadow-none">
        <MagicCard gradientColor="#D9D9D955" className="py-6">
          <CardHeader>
            <Badge className="mb-2">{note.category}</Badge>
            <CardTitle className="text-left">{note.title}</CardTitle>
          </CardHeader>
        </MagicCard>
      </Card>
    </Link>
  )
}

interface NotesMarqueeProps {
  notes?: Note[][]
}

export function NotesMarquee({ notes = DefaultNotes }: NotesMarqueeProps) {
  return (
    <div className="relative flex container flex-col items-center justify-center overflow-hidden">
      <ScrollVelocityContainer className="w-full mt-8">
        {notes.map((row, index) => (
          <ScrollVelocityRow
            key={row[0]?.href || index}
            baseVelocity={0.5}
            direction={index % 2 === 0 ? 1 : -1}
            className="py-4"
          >
            {row.map(note => (
              <NoteCard key={note.href} note={note} className="mx-3" />
            ))}
          </ScrollVelocityRow>
        ))}
      </ScrollVelocityContainer>

      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
    </div>
  )
}
