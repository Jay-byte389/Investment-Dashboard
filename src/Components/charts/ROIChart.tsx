"use client";
import { Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

export default function ROIChart({ data }: any) {
    return (
        <LineChart width={500} height={500} data={data}>
            <XAxis dataKey="company" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="roi" />
        </LineChart>
    )
}