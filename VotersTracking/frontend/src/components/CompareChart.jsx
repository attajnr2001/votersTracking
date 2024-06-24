import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, TextField, MenuItem, CircularProgress } from "@mui/material";
import {
  useGetConstituenciesQuery,
  useGetConstituencyDataQuery,
} from "../slices/votersApiSlice";
import { color } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [constituency1, setConstituency1] = useState("");
  const [constituency2, setConstituency2] = useState("");

  const { data: constituencies, isLoading: constituenciesLoading } =
    useGetConstituenciesQuery();
  const { data: data1, isLoading: loading1 } = useGetConstituencyDataQuery(
    constituency1,
    { skip: !constituency1 }
  );
  const { data: data2, isLoading: loading2 } = useGetConstituencyDataQuery(
    constituency2,
    { skip: !constituency2 }
  );

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Constituency Comparison",
        color: "red"
      },
    },
  };

  const chartData = {
    labels: ["Male", "Female", "Above 40", "Below 40"],
    datasets: [
      {
        label: constituency1,
        data: data1
          ? [data1.male, data1.female, data1.above40, data1.below40]
          : [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: constituency2,
        data: data2
          ? [data2.male, data2.female, data2.above40, data2.below40]
          : [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  if (constituenciesLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          select
          label="Constituency 1"
          value={constituency1}
          onChange={(e) => setConstituency1(e.target.value)}
          sx={{ width: "45%" }}
          
        >
          {constituencies.map((c) => (
            <MenuItem key={c.psCode} value={c.psCode}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Constituency 2"
          value={constituency2}
          onChange={(e) => setConstituency2(e.target.value)}
          sx={{ width: "45%" }}
        >
          {constituencies.map((c) => (
            <MenuItem key={c.psCode} value={c.psCode}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {loading1 || loading2 ? (
        <CircularProgress />
      ) : (
        <Bar options={options} data={chartData} />
      )}
    </Box>
  );
};

export default Chart;
