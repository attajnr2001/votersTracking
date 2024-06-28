import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
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
      name: "Male",
      ...constituenciesData.reduce(
        (acc, c) => ({ ...acc, [c.name]: c.male }),
        {}
      ),
      total: constituenciesData.reduce((sum, c) => sum + c.male, 0),
    },
    {
      name: "Female",
      ...constituenciesData.reduce(
        (acc, c) => ({ ...acc, [c.name]: c.female }),
        {}
      ),
      total: constituenciesData.reduce((sum, c) => sum + c.female, 0),
    },
    {
      name: "Above 40",
      ...constituenciesData.reduce(
        (acc, c) => ({ ...acc, [c.name]: c.above40 }),
        {}
      ),
      total: constituenciesData.reduce((sum, c) => sum + c.above40, 0),
    },
    {
      name: "Below 40",
      ...constituenciesData.reduce(
        (acc, c) => ({ ...acc, [c.name]: c.below40 }),
        {}
      ),
      total: constituenciesData.reduce((sum, c) => sum + c.below40, 0),
    },
  ];

  // Generate unique colors for each constituency
  const generateColor = (index) => {
    const hue = (index * 137.5) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Box sx={{ width: "100%", height: 500 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {constituenciesData.map((constituency, index) => (
            <Bar
              key={constituency.name}
              dataKey={constituency.name}
              fill={generateColor(index)}
              barSize={"5"}
            />
          ))}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#ff7300"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VotersChart;
