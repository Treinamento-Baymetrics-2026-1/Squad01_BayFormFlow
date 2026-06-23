import { AuthPage } from "@/pages/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";


export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
};
