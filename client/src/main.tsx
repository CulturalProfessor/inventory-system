import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./dashboard";
import SignUp from "./signup";
import Login from "./signin";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={"helpp"} />
      <Route path="/signin" element={<Login/>} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<App />} />
    </Routes>
  </BrowserRouter>
);
