"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
  value: number; // percentage of people in this bracket
  description: string;
  midpoint: number; // used for adjusting the reference line
}

const pensionData: PensionDataPoint[] = pensionDataJson;

const PensionDistributionChart: React.FC<PensionDistributionChartProps> = ({
  userRent,
}) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={pensionData}
        margin={{ top: 20, right: 40, bottom: 20, left: 0 }}
      >
        <XAxis
            dataKey="midpoint"
            type="number"
            domain={[0, 8000]}
            tickFormatter={(val) => {
                const bracket = pensionData.find(
                (d) => d.midpoint === val
                );
                return bracket?.range || `${val} zł`;
            }}
        />
        <YAxis
          tickFormatter={(val) => `${val}%`}
          domain={[0, Math.max(...pensionData.map((d) => d.value)) + 5]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const dataPoint = payload[0].payload as PensionDataPoint;
              return (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "10px",
                    border: "1px solid #ccc",
                  }}
                >
                  <strong>{dataPoint.range} zł</strong>
                  <div>{dataPoint.description}</div>
                  <div>Odsetek: {dataPoint.value}%</div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" fill="#84d88fff" />
        <ReferenceLine
          x={userRent}
          stroke="green"
          strokeWidth={2}
          label={{
            position: "top",
            value: `Twoja emerytura: ${userRent} zł`,
            fill: "green",
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PensionDistributionChart;
