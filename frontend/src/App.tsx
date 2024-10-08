import { Routes, Route } from "react-router-dom";
import { SignUp } from "./components/SignUp";
import Status from "./components/status";

export default function App() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/status" element={<Status />} />
    </Routes>
  )
}