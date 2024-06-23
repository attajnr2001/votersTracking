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
import { useGetAllConstituenciesDataQuery } from "../slices/votersApiSlice";
import { CircularProgress, Typography, Box } from "@mui/material";

const VotersChart = () => {
  const {
    data: constituenciesData,
    isLoading,
    error,
  } = useGetAllConstituenciesDataQuery();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography color="error">Error loading data: {error.message}</Typography>
    );
  }

  // Restructure the data
  const chartData = [
    {
      category: "Male",
      ...constituenciesData.reduce(
        (acc, constituency) => ({
          ...acc,
          [constituency.name]: constituency.male,
        }),
        {}
      ),
    },
    {
      category: "Female",
      ...constituenciesData.reduce(
        (acc, constituency) => ({
          ...acc,
          [constituency.name]: constituency.female,
        }),
        {}
      ),
    },
    {
      category: "Above 40",
      ...constituenciesData.reduce(
        (acc, constituency) => ({
          ...acc,
          [constituency.name]: constituency.above40,
        }),
        {}
      ),
    },
    {
      category: "Below 40",
      ...constituenciesData.reduce(
        (acc, constituency) => ({
          ...acc,
          [constituency.name]: constituency.below40,
        }),
        {}
      ),
    },
  ];

  // Generate unique colors for each constituency
  const generateColor = (index) => {
    const hue = (index * 137.5) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          {constituenciesData.map((constituency, index) => (
            <Area
              key={constituency.name}
              type="monotone"
              dataKey={constituency.name}
              stroke={generateColor(index)}
              fill={generateColor(index)}
              fillOpacity={0.3}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VotersChart;