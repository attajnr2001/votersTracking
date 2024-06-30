import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button } from "@mui/material";
import AllVoters from "../components/AllVoters";
import Chart from "../components/CompareChart";
import VotersChart from "../components/VotersChart";
import ConstituencyVotersChart from "../components/ConstituencyVotersChart";

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [showChart, setShowChart] = useState(false);

  const toggleChart = () => {
    setShowChart((prevShowChart) => !prevShowChart);
  };

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
        <>
          <Button onClick={toggleChart} variant="contained">
            {showChart ? "Hide Chart" : "Compare Electoral Areas"}
          </Button>
          {showChart && (
            <Box my={3}>
              <Chart />
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
