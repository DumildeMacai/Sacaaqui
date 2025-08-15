
"use client"

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface ChartData {
  name: string
  value: number
  fill: string
}

const chartConfig = {
  value: {
    label: "Quantidade",
  },
  com_dinheiro: {
    label: "Com Dinheiro",
    color: "hsl(var(--chart-2))",
  },
  sem_dinheiro: {
    label: "Sem Dinheiro",
    color: "hsl(var(--chart-1))",
  },
  desconhecido: {
    label: "Desconhecido",
    color: "hsl(var(--muted))",
  },
} satisfies Record<string, any>


interface AtmStatusChartProps {
  data: ChartData[]
}

export function AtmStatusChart({ data }: AtmStatusChartProps) {
  return (
    <div className="h-64 w-full">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <RechartsBarChart accessibilityLayer data={data} layout="vertical">
                 <XAxis type="number" hide />
                 <YAxis 
                    dataKey="name" 
                    type="category" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={5} />
            </RechartsBarChart>
        </ChartContainer>
    </div>
  )
}
