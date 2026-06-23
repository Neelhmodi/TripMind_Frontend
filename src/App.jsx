import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';

function ResultsRedirect() {
  const location = useLocation();
  return <Navigate to={`/flights${location.search}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsRedirect />} />
        <Route path="/flights" element={<ResultsPage />} />
        <Route path="/hotels" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}