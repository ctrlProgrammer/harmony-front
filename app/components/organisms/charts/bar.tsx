import { SellerHistoricalData } from "@/app/core/types";
import React, { PureComponent } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BarChartProps {
  data: SellerHistoricalData[];
}

export const BarChartComponent = (props: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" background={{ fill: "#eee" }} />
      </BarChart>
    </ResponsiveContainer>
  );
};
