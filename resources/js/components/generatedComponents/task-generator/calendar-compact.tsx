// CalendarCompact - Calendario con selezione data e ora
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { fmtDateHuman, calculateQuickDate } from "./utils";
import { MONTHS, QUICK_DATE_OPTIONS } from "./constants";

type CalendarCompactProps = {
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
};

export const CalendarCompact: React.FC<CalendarCompactProps> = ({ 
    value, 
    onChange, 
    label = "Data" 
}) => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
    const [selectedTime, setSelectedTime] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [hasSelectedTime, setHasSelectedTime] = useState(false);

    useEffect(() => {
        if (value) {
            const date = new Date(value);
            setSelectedDate(date);
            setCurrentMonth(date.getMonth());
            setCurrentYear(date.getFullYear());
            const hours = date.getHours();
            const minutes = date.getMinutes();
            setSelectedTime(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
            setHasSelectedTime(true);
        } else {
            // Reset quando value è null
            setSelectedDate(null);
            setSelectedTime("");
            setHasSelectedTime(false);
            setCurrentMonth(new Date().getMonth());
            setCurrentYear(new Date().getFullYear());
        }
    }, [value]);

    const selectQuick = (type: string) => {
        const { date: targetDate, time: targetTime } = calculateQuickDate(type);
        setSelectedDate(targetDate);
        setSelectedTime(targetTime);
        setHasSelectedTime(true);
        setCurrentMonth(targetDate.getMonth());
        setCurrentYear(targetDate.getFullYear());
    };

    const generateCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const prevLastDay = new Date(currentYear, currentMonth, 0);

        let firstDayOfWeek = firstDay.getDay();
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const lastDate = lastDay.getDate();
        const prevLastDate = prevLastDay.getDate();
        const days = [];

        for (let i = firstDayOfWeek; i > 0; i--) {
            days.push({ day: prevLastDate - i + 1, isDisabled: true, isCurrentMonth: false });
        }

        const today = new Date();
        for (let day = 1; day <= lastDate; day++) {
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const isSelected = selectedDate && day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();

            days.push({ day, isToday, isSelected, isCurrentMonth: true });
        }

        const remainingDays = 42 - days.length;
        for (let day = 1; day <= remainingDays; day++) {
            days.push({ day, isDisabled: true, isCurrentMonth: false });
        }

        return days;
    };

    const selectDate = (day: any) => {
        if (!day.isDisabled) {
            const newDate = new Date(currentYear, currentMonth, day.day);
            setSelectedDate(newDate);
        }
    };

    const selectTime = (time: string) => {
        setSelectedTime(time);
        setHasSelectedTime(true);
    };

    const confirmSelection = () => {
        if (selectedDate) {
            if (hasSelectedTime && selectedTime) {
                const [hours, minutes] = selectedTime.split(":");
                selectedDate.setHours(parseInt(hours), parseInt(minutes));
            }
            onChange(selectedDate.toISOString());
            setOpen(false);
        }
    };

    const changeMonth = (direction: number) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" aria-label={label} className="rounded-button-sm border-2 hover:bg-accent">
                    {selectedDate ? fmtDateHuman(selectedDate) : "📅 Seleziona"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0 shadow-xl" align="end">
                <div className="bg-primary text-primary-foreground px-3 py-2 text-xs rounded-t-lg">
                    {selectedDate
                        ? `${selectedDate.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })} ${hasSelectedTime && selectedTime ? selectedTime : ""}`
                        : "Seleziona data"}
                </div>

                <div className="flex">
                    {/* Colonna quick actions */}
                    <div className="w-1/3 bg-muted p-2 border-r">
                        <h4 className="text-xs font-bold text-muted-foreground mb-1">RAPIDO</h4>
                        <div className="space-y-1">
                            {QUICK_DATE_OPTIONS.map((option) => (
                                <Button 
                                    key={option.id}
                                    type="button" 
                                    onClick={() => selectQuick(option.id)} 
                                    variant="outline" 
                                    size="sm" 
                                    className="quick-btn w-full justify-start text-xs"
                                >
                                    {option.icon} {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Colonna calendario */}
                    <div className="flex-1 p-2">
                        <div className="flex items-center justify-between mb-2">
                            <Button type="button" onClick={() => changeMonth(-1)} variant="ghost" size="sm" className="p-1 h-auto">
                                ←
                            </Button>
                            <div className="flex items-center gap-1">
                                <Select value={String(currentMonth)} onValueChange={(v) => setCurrentMonth(parseInt(v))}>
                                    <SelectTrigger className="w-16 h-7 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTHS.map((month, index) => (
                                            <SelectItem key={index} value={String(index)}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={String(currentYear)} onValueChange={(v) => setCurrentYear(parseInt(v))}>
                                    <SelectTrigger className="w-20 h-7 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[2024, 2025, 2026].map((year) => (
                                            <SelectItem key={year} value={String(year)}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="button" onClick={() => changeMonth(1)} variant="ghost" size="sm" className="p-1 h-auto">
                                →
                            </Button>
                        </div>

                        <div className="calendar-grid text-xs font-semibold text-muted-foreground mb-1">
                            <div>L</div>
                            <div>M</div>
                            <div>M</div>
                            <div>G</div>
                            <div>V</div>
                            <div>S</div>
                            <div>D</div>
                        </div>
                        <div className="calendar-grid mb-2">
                            {generateCalendarDays().map((day, index) => (
                                <div
                                    key={index}
                                    onClick={() => selectDate(day)}
                                    className={`calendar-day ${day.isDisabled ? "disabled" : ""} ${day.isToday ? "today" : ""} ${day.isSelected ? "selected" : ""}`}
                                >
                                    {day.day}
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-2">
                            <h4 className="text-xs font-bold text-muted-foreground mb-1">ORARIO</h4>

                            <div className="grid grid-cols-4 gap-1 mb-1">
                                {["09:00", "12:00", "15:00", "18:00"].map((time) => (
                                    <div key={time} onClick={() => selectTime(time)} className={`time-slot ${selectedTime === time ? "selected" : ""}`}>
                                        {time}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-1 items-center">
                                <Select
                                    value={selectedTime ? selectedTime.split(":")[0] : "09"}
                                    onValueChange={(v) => {
                                        const mins = selectedTime ? selectedTime.split(":")[1] : "00";
                                        setSelectedTime(`${v}:${mins}`);
                                        setHasSelectedTime(true);
                                    }}
                                >
                                    <SelectTrigger className="flex-1 h-7 text-xs border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <SelectItem key={i} value={String(i).padStart(2, "0")}>
                                                {String(i).padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="flex items-center text-xs font-bold">:</span>
                                <Select
                                    value={selectedTime ? selectedTime.split(":")[1] : "00"}
                                    onValueChange={(v) => {
                                        const hrs = selectedTime ? selectedTime.split(":")[0] : "09";
                                        setSelectedTime(`${hrs}:${v}`);
                                        setHasSelectedTime(true);
                                    }}
                                >
                                    <SelectTrigger className="flex-1 h-7 text-xs border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 60 }, (_, i) => (
                                            <SelectItem key={i} value={String(i).padStart(2, "0")}>
                                                {String(i).padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t p-2 bg-muted flex justify-end rounded-b-lg">
                    <Button type="button" onClick={confirmSelection} size="sm" className="rounded-button-sm bg-primary hover:bg-primary/90">
                        Conferma
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
