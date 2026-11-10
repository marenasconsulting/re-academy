import { BookOpen, Braces, Network, Workflow, type LucideProps } from 'lucide-react'
export function Icon({ name, ...props }: LucideProps & { name: string }) {
  const Component = ({ requirements: BookOpen, technology: Braces, projects: Workflow, practice: Network })[name] ?? BookOpen
  return <Component aria-hidden="true" {...props} />
}
