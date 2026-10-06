import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { notifications } from "@/data/notifications"

export function NotificationsMenu() {
  const unread = notifications.filter((item) => item.unread).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications, ${unread} unread`}
        >
          <Bell />
          <span className="absolute top-1 right-1 flex min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-medium text-primary-foreground">
            {unread}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-3 py-2.5">
          <h2 className="text-sm font-medium">Notifications</h2>
          <p className="text-xs text-muted-foreground">{unread} unread</p>
        </div>
        <ul>
          {notifications.map((item) => (
            <li key={item.id} className="border-b px-3 py-3 last:border-b-0">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{item.title}</p>
                {item.unread ? (
                  <span className="shrink-0 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                    Unread
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{item.timeLabel}</p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
