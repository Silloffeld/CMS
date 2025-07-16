"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChartConfig {
    [key: string]: {
        label: string
        color: string
    }
}

const ChartContainer = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig
}
>(({ className, config, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("w-full", className)}
            style={
                {
                    "--color-value": config.value?.color || "#3b82f6",
                } as React.CSSProperties
            }
            {...props}
        >
            {children}
        </div>
    )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div {...props}>{children}</div>
}

const ChartTooltipContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return <div {...props}>{children}</div>
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
