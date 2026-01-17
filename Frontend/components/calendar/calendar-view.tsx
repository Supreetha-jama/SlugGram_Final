"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface CalendarEvent {
  id: string
  content: string
  post_type: string
  event_date: string
  event_location?: string
  profiles: { display_name: string }
}

interface CalendarViewProps {
  events: CalendarEvent[]
}

export function CalendarView({ events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      if (!event.event_date) return false
      return isSameDay(new Date(event.event_date), day)
    })
  }

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : []

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
    setSheetOpen(true)
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="h-10 w-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="h-10 w-10"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 flex-1 gap-1">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isToday = isSameDay(day, new Date())
            const hasEvents = dayEvents.length > 0

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`
                  relative flex flex-col items-center justify-center rounded-xl
                  transition-all active:scale-95 min-h-[44px]
                  ${!isCurrentMonth ? "opacity-30" : ""}
                  ${isSelected ? "bg-primary text-primary-foreground" : ""}
                  ${isToday && !isSelected ? "ring-2 ring-primary ring-inset" : ""}
                  ${!isSelected && isCurrentMonth ? "active:bg-muted" : ""}
                `}
              >
                <span className={`text-sm font-medium ${hasEvents && !isSelected ? "mb-1" : ""}`}>
                  {format(day, "d")}
                </span>
                {hasEvents && (
                  <div className="flex gap-0.5 absolute bottom-1">
                    {dayEvents.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${isSelected ? "bg-primary-foreground" : "bg-accent"}`}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Event Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl">
          <SheetHeader className="pb-4">
            <SheetTitle>{selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto">
            {selectedEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-muted rounded-2xl space-y-2">
                    <p className="font-medium">{event.content}</p>
                    <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                      {event.event_date && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {format(new Date(event.event_date), "h:mm a")}
                        </div>
                      )}
                      {event.event_location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.event_location}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">by {event.profiles.display_name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No events on this day</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
