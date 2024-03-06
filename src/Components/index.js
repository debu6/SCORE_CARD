import React from "react";
import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import CreateScoreCard from "./CreateScorecard";
import ScorecardTable from "./ScoreCradTable";
import EditScoreCard from "./EditScoreCard";

const Root = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<ScorecardTable />} />
        <Route path="/create" element={<CreateScoreCard />} />
        <Route path="/Update" element={<EditScoreCard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
