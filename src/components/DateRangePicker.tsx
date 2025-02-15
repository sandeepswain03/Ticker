import React from 'react';
import { format, isAfter, isBefore, isValid } from "date-fns"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DatePickerProps {
    startDate: Date;
    endDate: Date;
    onStartDateChange: (date: Date | undefined) => void;
    onEndDateChange: (date: Date | undefined) => void;
    minDate?: Date;
    maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    minDate,
    maxDate = new Date()
}) => {
    const [error, setError] = React.useState<string | null>(null);

    const handleStartDateChange = (date: Date | undefined) => {
        setError(null);
        if (date && endDate && isAfter(date, endDate)) {
            setError("Start date cannot be after end date");
            return;
        }
        if (date && maxDate && isAfter(date, maxDate)) {
            setError("Start date cannot be after today");
            return;
        }
        if (date && minDate && isBefore(date, minDate)) {
            setError("Start date cannot be before minimum date");
            return;
        }
        onStartDateChange(date);
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setError(null);
        if (date && startDate && isBefore(date, startDate)) {
            setError("End date cannot be before start date");
            return;
        }
        if (date && maxDate && isAfter(date, maxDate)) {
            setError("End date cannot be after today");
            return;
        }
        onEndDateChange(date);
    };

    return (
        <Card className="p-4 md:p-6 shadow-lg">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 w-full">
                    <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal hover:bg-gray-50 transition-colors
                                    ${isValid(startDate) ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                                {isValid(startDate) ? format(startDate, "PPP") : "Select start date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border rounded-lg shadow-lg" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={handleStartDateChange}
                                initialFocus
                                disabled={(date) =>
                                    isAfter(date, maxDate) ||
                                    (minDate ? isBefore(date, minDate) : false)
                                }
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
                                    ${isValid(endDate) ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                                {isValid(endDate) ? format(endDate, "PPP") : "Select end date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border rounded-lg shadow-lg" align="start">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={handleEndDateChange}
                                initialFocus
                                disabled={(date) =>
                                    isAfter(date, maxDate) ||
                                    (startDate && isBefore(date, startDate))
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