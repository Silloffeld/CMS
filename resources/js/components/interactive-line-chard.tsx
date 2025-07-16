"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react"

export interface ChartData {
    date: string
    value: number
    category?: string
    details?: string
    [key: string]: any
}

export interface ChartConfig {
    valueLabel?: string
    dateLabel?: string
    showSearch?: boolean
    showAverage?: boolean
    showAnimation?: boolean
    showTrend?: boolean
    height?: string
    color?: string
}

interface HoverPopupProps {
    data: ChartData | null
    position: { x: number; y: number }
    visible: boolean
    config: ChartConfig
}

function HoverPopup({ data, position, visible, config }: HoverPopupProps) {
    if (!visible || !data) return null

    return (
        <div
            className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 pointer-events-none transition-opacity duration-200"
            style={{
                left: position.x + 10,
                top: position.y - 10,
                transform: "translateY(-100%)",
            }}
        >
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color || "#3b82f6" }}></div>
                    <span className="font-semibold text-sm">{data.date}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: config.color || "#3b82f6" }}>
                    {data.value}
                </div>
                {data.category && <div className="text-xs text-gray-500">{data.category}</div>}
                {data.details && <div className="text-sm text-gray-700 max-w-48">{data.details}</div>}
            </div>
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200"></div>
        </div>
    )
}

export interface InteractiveLineChartProps {
    data: ChartData[]
    config?: ChartConfig
    onPointClick?: (data: ChartData) => void
    onDataFilter?: (filteredData: ChartData[]) => void
    loading?: boolean
    error?: string
}

export function InteractiveLineChart({
                                         data = [],
                                         config = {},
                                         onPointClick,
                                         onDataFilter,
                                         loading = false,
                                         error,
                                     }: InteractiveLineChartProps) {
    const {
        valueLabel = "Value",
        dateLabel = "Date",
        showSearch = true,
        showAverage: defaultShowAverage = true,
        showAnimation: defaultShowAnimation = true,
        showTrend = true,
        height = "400px",
        color = "#3b82f6",
    } = config

    const [selectedPoint, setSelectedPoint] = useState<ChartData | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [showAverage, setShowAverage] = useState(defaultShowAverage)
    const [animationEnabled, setAnimationEnabled] = useState(defaultShowAnimation)
    const [hoverData, setHoverData] = useState<ChartData | null>(null)
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
    const [showHoverPopup, setShowHoverPopup] = useState(false)
    const chartRef = useRef<HTMLDivElement>(null)

    const filteredData = useMemo(() => {
        if (!searchTerm) return data
        return data.filter(
            (item) =>
                item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.details && item.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())),
        )
    }, [data, searchTerm])

    useMemo(() => {
        if (onDataFilter) {
            onDataFilter(filteredData)
        }
    }, [filteredData, onDataFilter])

    const averageValue = useMemo(() => {
        if (filteredData.length === 0) return 0
        return filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length
    }, [filteredData])

    const trend = useMemo(() => {
        if (filteredData.length < 2) return "neutral"
        const firstValue = filteredData[0].value
        const lastValue = filteredData[filteredData.length - 1].value
        return lastValue > firstValue ? "up" : lastValue < firstValue ? "down" : "neutral"
    }, [filteredData])

    const handlePointClick = (chartData: any) => {
        const pointData = chartData.payload
        setSelectedPoint(pointData)
        if (onPointClick) {
            onPointClick(pointData)
        }
    }

    const clearSelection = () => {
        setSelectedPoint(null)
    }

    const handleMouseMove = useCallback((event: any) => {
        if (event && event.activePayload && event.activePayload[0]) {
            const data = event.activePayload[0].payload
            setHoverData(data)
            setHoverPosition({ x: event.chartX || 0, y: event.chartY || 0 })
            setShowHoverPopup(true)
        }
    }, [])

    const handleMouseLeave = useCallback(() => {
        setShowHoverPopup(false)
        setHoverData(null)
    }, [])

    const getTrendIcon = () => {
        switch (trend) {
            case "up":
                return <TrendingUp className="h-4 w-4 text-green-500" />
            case "down":
                return <TrendingDown className="h-4 w-4 text-red-500" />
            default:
                return <Minus className="h-4 w-4 text-gray-500" />
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="border-red-200">
                <CardContent className="pt-6 text-center">
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        )
    }

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">No data available to display.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Interactive Controls */}
            <div className="flex flex-wrap gap-4 items-center">
                {showSearch && (
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search data..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                )}
                <Button variant={showAverage ? "default" : "outline"} onClick={() => setShowAverage(!showAverage)} size="sm">
                    Show Average
                </Button>
                <Button
                    variant={animationEnabled ? "default" : "outline"}
                    onClick={() => setAnimationEnabled(!animationEnabled)}
                    size="sm"
                >
                    Animation
                </Button>
                {selectedPoint && (
                    <Button variant="outline" onClick={clearSelection} size="sm">
                        Clear Selection
                    </Button>
                )}
            </div>

            {/* Stats Bar */}
            {showTrend && (
                <div className="flex flex-wrap gap-4 items-center">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        {getTrendIcon()}
                        Trend: {trend}
                    </Badge>
                    <Badge variant="outline">Data Points: {filteredData.length}</Badge>
                    <Badge variant="outline">Average: {averageValue.toFixed(1)}</Badge>
                    {selectedPoint && (
                        <Badge variant="default">
                            Selected: {selectedPoint.date} - {selectedPoint.value}
                        </Badge>
                    )}
                </div>
            )}

            {/* Chart */}
            <div className="relative" ref={chartRef}>
                <ChartContainer
                    config={{
                        value: {
                            label: valueLabel,
                            color: color,
                        },
                    }}
                    className="w-full"
                    style={{ minHeight: height }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={filteredData}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 12,
                                bottom: 12,
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <ChartTooltip content={""} />
                            {showAverage && (
                                <ReferenceLine
                                    y={averageValue}
                                    stroke={color}
                                    strokeDasharray="5 5"
                                    opacity={0.6}
                                    label={{ value: `Avg: ${averageValue.toFixed(1)}`, position: "insideTopRight" }}
                                />
                            )}
                            <Line
                                dataKey="value"
                                type="monotone"
                                stroke={color}
                                strokeWidth={3}
                                dot={{
                                    fill: color,
                                    strokeWidth: 2,
                                    r: 6,
                                    cursor: "pointer",
                                }}
                                activeDot={{
                                    r: 8,
                                    stroke: color,
                                    strokeWidth: 2,
                                    fill: "white",
                                    cursor: "pointer",
                                    onClick: handlePointClick,
                                }}
                                animationDuration={animationEnabled ? 1000 : 0}
                                animationEasing="ease-in-out"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>

                <HoverPopup data={hoverData} position={hoverPosition} visible={showHoverPopup} config={config} />
            </div>

            {/* Selected Point Details */}
            {selectedPoint && (
                <Card className="border-l-4" style={{ borderLeftColor: color }}>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{dateLabel}</p>
                                <p className="text-lg font-semibold">{selectedPoint.date}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{valueLabel}</p>
                                <p className="text-lg font-semibold">{selectedPoint.value}</p>
                            </div>
                            {selectedPoint.category && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Category</p>
                                    <p className="text-lg font-semibold">{selectedPoint.category}</p>
                                </div>
                            )}
                            {selectedPoint.details && (
                                <div className="md:col-span-3">
                                    <p className="text-sm font-medium text-gray-500">Details</p>
                                    <p className="text-base">{selectedPoint.details}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {filteredData.length === 0 && searchTerm && (
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-gray-500">No data matches your search criteria.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
