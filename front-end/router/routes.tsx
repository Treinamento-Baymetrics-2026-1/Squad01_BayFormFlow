
import { AuthPage } from "@/pages/Auth";
import { SurveyPage } from "@/pages/Survey";
import { BrowserRouter, Routes, Route } from "react-router-dom";


export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/pesquisas" element={<SurveyPage />} />
      </Routes>
    </BrowserRouter>
  );
};
