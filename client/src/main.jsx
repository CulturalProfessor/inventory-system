import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={"helpp"} />
        </Routes>
      </BrowserRouter>  
);
