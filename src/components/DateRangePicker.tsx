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
import { Card } from "@/components/ui/card"

interface DatePickerProps {
    startDate: Date;
    endDate: Date;
    onStartDateChange: (date: Date | undefined) => void;
    onEndDateChange: (date: Date | undefined) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange
}) => {
    return (
        <Card className="p-4 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 w-full">
                    <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal hover:bg-gray-50 transition-colors
                                    ${startDate ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                                {startDate ? format(startDate, "PPP") : "Select start date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border rounded-lg shadow-lg" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={onStartDateChange}
                                initialFocus
                                disabled={(date) => date > new Date() || (endDate && date > endDate)}
                                className="rounded-lg border-0"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2 w-full">
                    <Label className="text-sm font-medium text-gray-700">End Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal hover:bg-gray-50 transition-colors
                                    ${endDate ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                                {endDate ? format(endDate, "PPP") : "Select end date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border rounded-lg shadow-lg" align="start">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={onEndDateChange}
                                initialFocus
                                disabled={(date) =>
                                    date > new Date() ||
                                    (startDate && date < startDate)
                                }
                                className="rounded-lg border-0"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </Card>
    );
};

export default DatePicker;