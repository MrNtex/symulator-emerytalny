"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import pensionDataJson from "@/shared/data/pensionData.json";

interface PensionDistributionChartProps {
  userRent: number;
}

interface PensionDataPoint {
  range: string;
  value: number;
  description: string;
  midpoint: number;
}

const pensionData: PensionDataPoint[] = pensionDataJson;

const PensionDistributionChart: React.FC<PensionDistributionChartProps> = ({
  userRent,
}) => {
  return (
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={pensionData}
        margin={{ top: 10, right: 30, bottom: 25, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
        <XAxis
          dataKey="midpoint"
          type="number"
          domain={[0, 8000]}
          tick={{ fontSize: 11, fill: "#00416E" }}
          tickFormatter={(val) => {
            const bracket = pensionData.find((d) => d.midpoint === val);
            return bracket?.range || `${val} zł`;
          }}
          label={{
            value: "Przedziały emerytur (zł)",
            position: "bottom",
            offset: 0,
            fontSize: 12,
            fill: "#00416E",
          }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#00416E" }}
          tickFormatter={(val) => `${val}%`}
          domain={[0, Math.max(...pensionData.map((d) => d.value)) + 5]}
          label={{
            value: "Odsetek emerytów (%)",
            angle: -90,
            position: "insideLeft",
            offset: 10,
            fontSize: 12,
            fill: "#00416E",
          }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const dataPoint = payload[0].payload as PensionDataPoint;
              return (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "8px 10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "12px",
                    color: "#00416E",
                  }}
                >
                  <strong style={{ color: "#00993F" }}>{dataPoint.range} zł</strong>
                  <div>{dataPoint.description}</div>
                  <div>Odsetek: {dataPoint.value}%</div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" fill="#00993F" radius={[4, 4, 0, 0]} />
        <ReferenceLine
          x={userRent}
          stroke="#FFBB00"
          strokeWidth={2}
          label={{
            position: "insideTop",
            offset: 14,
            value: `Twoja emerytura: ${userRent} zł`,
            fill: "#00416E",
            fontSize: 12,
            fontWeight: 700,
            textAnchor: "middle",
            style: { textShadow: "1px 1px 2px rgba(255,255,255,0.9)" },
          }}
        />


      </BarChart>
    </ResponsiveContainer>
  );
};

export default PensionDistributionChart;
