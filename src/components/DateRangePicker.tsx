import React from 'react';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

const DatePicker = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4">
            <div className="flex-1">
                <Label className="mb-2 block">Start Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Select start date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={onStartDateChange}
                            initialFocus
                            disabled={(date) => date > new Date() || (endDate && date > endDate)}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex-1">
                <Label className="mb-2 block">End Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Select end date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={onEndDateChange}
                            initialFocus
                            disabled={(date) =>
                                date > new Date() ||
                                (startDate && date < startDate)
                            }
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default DatePicker;