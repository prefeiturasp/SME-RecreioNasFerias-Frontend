import { ChevronDownIcon } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export function CollapsibleFilter({
  icon,
  title,
  children,
}: Readonly<{
  icon?: React.ReactNode
  title: string
  children: React.ReactNode
}>) {
  return (
    <Card className="rounded-sm py-0">
      <CardContent className="p-0">
        <Collapsible className="w-full" defaultOpen={true}>
          <CollapsibleTrigger asChild>
            <div className="cursor-pointer group flex items-center border-b border-b-gray-300 px-5 py-3 text-primary font-semibold">
              <div className="w-auto flex-none pr-2">{icon}</div>
              <div className="w-auto grow">{title}</div>
              <div className="w-auto flex-none">
                <ChevronDownIcon className="ml-auto size-6 text-primary transition-transform group-data-[state=open]:rotate-180" />
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className="p-5">{children}</CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
