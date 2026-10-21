import * as React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HomePage } from '@/pages/home-page';
import { SystemPage } from '@/pages/system-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { CalculatorPage } from '@/pages/calculator-page';
import { GuidePage } from '@/pages/guide-page';
import { ResearchPage } from '@/pages/research-page';
import { NotFoundPage } from '@/pages/not-found-page';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/system" element={<SystemPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
