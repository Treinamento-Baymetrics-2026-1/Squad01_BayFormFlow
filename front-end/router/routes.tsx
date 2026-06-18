import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage } from "../src/pages/Auth/AuthPage";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
};
