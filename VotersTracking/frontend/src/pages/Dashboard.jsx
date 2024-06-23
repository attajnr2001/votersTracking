import React from "react";
import Widget from "../components/Widget";
import { Box } from "@mui/material";
import AllVoters from "../components/AllVoters";
import Chart from "../components/CompareChart";
import VotersChart from "../components/VotersChart";

const Dashboard = () => {
  return (
    <>
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 2,
          padding: 2,
        }}
      >
        <Widget type="all" />
        <Widget type="below40" />
        <Widget type="above40" />
      </Box>

      <Box my={3}>
        <AllVoters />
      </Box>
      <Box my={3}>
        <Chart />
      </Box>
      <Box my={3}>
        <VotersChart />
      </Box>
    </>
  );
};

export default Dashboard;
