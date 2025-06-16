import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loading-text">Finding Suitable Candidates</div>
      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>
    </div>
  );
};

export default Loader;
