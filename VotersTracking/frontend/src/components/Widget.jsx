import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton, Typography, Box } from "@mui/material";
import { PeopleAlt, TrendingDown, TrendingUp } from "@mui/icons-material";
import {
  useGetTotalVotersQuery,
  useGetVotersBelow40Query,
  useGetVotersAbove40Query,
} from "../slices/votersApiSlice";
import "../styles/widget.css";

const Widget = React.memo(({ type, psCode }) => {
  const {
    data: totalData,
    isLoading: totalLoading,
    error: totalError,
  } = useGetTotalVotersQuery(psCode);
  const {
    data: below40Data,
    isLoading: below40Loading,
    error: below40Error,
  } = useGetVotersBelow40Query(psCode);
  const {
    data: above40Data,
    isLoading: above40Loading,
    error: above40Error,
  } = useGetVotersAbove40Query(psCode);

  const getTitle = () => {
    switch (type) {
      case "all":
        return "TOTAL VOTERS";
      case "below40":
        return "VOTERS BELOW 40";
      case "above40":
        return "VOTERS ABOVE 40";
      default:
        return "VOTERS";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "all":
        return <PeopleAlt sx={{ color: "blue" }} />;
      case "below40":
        return <TrendingDown sx={{ color: "green" }} />;
      case "above40":
        return <TrendingUp sx={{ color: "red" }} />;
      default:
        return <PeopleAlt sx={{ color: "blue" }} />;
    }
  };

  const getData = () => {
    switch (type) {
      case "all":
        return { data: totalData, isLoading: totalLoading, error: totalError };
      case "below40":
        return {
          data: below40Data,
          isLoading: below40Loading,
          error: below40Error,
        };
      case "above40":
        return {
          data: above40Data,
          isLoading: above40Loading,
          error: above40Error,
        };
      default:
        return { data: null, isLoading: false, error: null };
    }
  };

  const { data, isLoading, error } = getData();

  if (isLoading) {
    return <Skeleton variant="rectangular" width={210} height={118} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="widget"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="left">
          <span className="title">{getTitle()}</span>
          <span className="pop">{data ? data.total : "N/A"}</span>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2">
              Male: {data ? data.male : "N/A"}
            </Typography>
            |
            <Typography variant="body2">
              Female: {data ? data.female : "N/A"}
            </Typography>
          </Box>
        </div>
        <div className="right">{getIcon()}</div>
      </motion.div>
    </AnimatePresence>
  );
});

export default Widget;
