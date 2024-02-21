import React from "react";
import { Route, Routes } from "react-router-dom";
import CommonLayout from "../layout/CommonLayout";
import Home from "../pages/home/Home";

type Props = {};

const Router = (props: Props) => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CommonLayout children={<Home />} />} />
      </Routes>
    </div>
  );
};

export default Router;
