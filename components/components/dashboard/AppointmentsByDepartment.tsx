"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AppointmentsByDepartment({
  data,
  text,
}: {
  data: any[];
  text: string;
}) {
  return (
    <div className="w-full md:w-[70%] bg-white backdrop-blur-md rounded-3xl p-6 text-black transition-all duration-500 ease-in-out hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
      <p className="text-xl font-semibold text-gray-800 mb-4 tracking-tight">
        {text}
      </p>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
            barCategoryGap={20}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#f3f4f6"
              vertical={false}
            />
            <XAxis
              dataKey="department"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
                fontWeight: 500,
                textAnchor: "end",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
                fontWeight: 500,
              }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              contentStyle={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              }}
              labelStyle={{
                fontWeight: 600,
                color: "#4B5563",
                fontSize: 14,
              }}
              itemStyle={{
                fontSize: 13,
                color: "#111827",
              }}
            />
            <Bar
              dataKey="value"
              barSize={30}
              radius={[12, 12, 0, 0]}
              fill="url(#gradient)"
              animationDuration={900}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
