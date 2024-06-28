import React from "react";
import Widget from "../components/Widget";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import AllVoters from "../components/AllVoters";
import Chart from "../components/CompareChart";
import VotersChart from "../components/VotersChart";
import ConstituencyVotersChart from "../components/ConstituencyVotersChart";

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <Box my={3}>
        <AllVoters />
      </Box>

      <Box my={3}>
        {userInfo.psCode === "all" ? (
          <VotersChart />
        ) : (
          <ConstituencyVotersChart psCode={userInfo.psCode} />
        )}
      </Box>
      {userInfo.psCode === "all" && (
        <Box my={3}>
          <Chart />
        </Box>
      )}
    </>
  );
};

export default Dashboard;
