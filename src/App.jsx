import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

function ResultsRedirect() {
  const location = useLocation();
  return <Navigate to={`/flights${location.search}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsRedirect />} />
        <Route path="/flights" element={<ResultsPage />} />
        <Route path="/hotels" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}