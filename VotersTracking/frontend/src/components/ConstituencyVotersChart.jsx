import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetConstituencyDataQuery } from "../slices/votersApiSlice";
import { CircularProgress, Typography, Box } from "@mui/material";

const ConstituencyVotersChart = ({ psCode }) => {
  const {
    data: constituencyData,
    isLoading,
    error,
  } = useGetConstituencyDataQuery(psCode);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography color="error">Error loading data: {error.message}</Typography>
    );
  }

  const chartData = [
    { category: "Male", value: constituencyData.male },
    { category: "Female", value: constituencyData.female },
    { category: "Above 40", value: constituencyData.above40 },
    { category: "Below 40", value: constituencyData.below40 },
  ];

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ConstituencyVotersChart;
