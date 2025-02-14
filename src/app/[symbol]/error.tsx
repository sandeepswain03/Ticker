// app/(stocks)/[symbol]/error.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-semibold">Something went wrong!</h2>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}