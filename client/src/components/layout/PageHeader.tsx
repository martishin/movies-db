interface PageHeaderProps {
  title: string
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div>
      <h2 className="text-center text-xl font-bold tracking-tight">{title}</h2>
      <hr className="mt-1" />
    </div>
  )
}
