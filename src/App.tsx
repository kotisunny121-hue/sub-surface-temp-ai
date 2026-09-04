import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
import { SixPanelLayout } from './components/SixPanelLayout';
import { DashboardPage } from './pages/DashboardPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { PreprocessingPage } from './pages/PreprocessingPage';
import { PatternAnalysisPage } from './pages/PatternAnalysisPage';
import { PredictionPage } from './pages/PredictionPage';
import { ValidationPage } from './pages/ValidationPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { HackathonPage } from './pages/HackathonPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { 
  fetchArgoFloats, 
  fetchOscarData, 
  fetchAscatData, 
  fetchCcmpData,
  getFallbackArgoFloats
} from './services/oceanDataService';
import { ArgoFloat, DataMode } from './types/ocean';
import { Waves, ShieldCheck, Database, GitBranch } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('grid');
  const [dataMode, setDataMode] = useState<DataMode>('real_plus_synthetic');
  
  // Interactive coordinates & parameters
  const [selectedLat, setSelectedLat] = useState<number>(14.0);
  const [selectedLon, setSelectedLon] = useState<number>(88.0);
  const [selectedDate, setSelectedDate] = useState<string>('2020-01-15');
  const [selectedDepth, setSelectedDepth] = useState<number>(100);

  // Loaded ocean dataset states
  const [argoFloats, setArgoFloats] = useState<ArgoFloat[]>(() => getFallbackArgoFloats());
  const [oscarData, setOscarData] = useState<any>(null);
  const [ascatData, setAscatData] = useState<any>(null);
  const [ccmpData, setCcmpData] = useState<any>(null);

  useEffect(() => {
    // Ingest data
    fetchArgoFloats().then(setArgoFloats);
    fetchOscarData().then(setOscarData);
    fetchAscatData().then(setAscatData);
    fetchCcmpData().then(setCcmpData);
  }, []);

  const handleSelectLocation = (lat: number, lon: number) => {
    setSelectedLat(lat);
    setSelectedLon(lon);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A] antialiased">
      {/* 1. Transparent Scientific Disclaimer Banner */}
      <DisclaimerBanner 
        dataMode={dataMode}
        onToggleDataMode={setDataMode}
      />

      {/* 2. Primary Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onSelectPage={setCurrentPage}
        dataMode={dataMode}
        onToggleDataMode={setDataMode}
      />

      {/* 3. Dynamic Page View */}
      <main className="flex-1 pb-16">
        {currentPage === 'grid' && (
          <SixPanelLayout
            selectedLat={selectedLat}
            selectedLon={selectedLon}
            onSelectLocation={handleSelectLocation}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedDepth={selectedDepth}
            onSelectDepth={setSelectedDepth}
            dataMode={dataMode}
            argoFloats={argoFloats}
            onNavigateToPage={setCurrentPage}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            selectedLat={selectedLat}
            selectedLon={selectedLon}
            onSelectLocation={handleSelectLocation}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedDepth={selectedDepth}
            onSelectDepth={setSelectedDepth}
            dataMode={dataMode}
            argoFloats={argoFloats}
            oscarData={oscarData}
            ascatData={ascatData}
            ccmpData={ccmpData}
          />
        )}

        {(currentPage === 'datasources' || currentPage === 'data-sources') && (
          <DataSourcesPage
            dataMode={dataMode}
            onToggleDataMode={setDataMode}
          />
        )}

        {currentPage === 'preprocessing' && (
          <PreprocessingPage />
        )}

        {(currentPage === 'patterns' || currentPage === 'pattern-analysis') && (
          <PatternAnalysisPage />
        )}

        {currentPage === 'prediction' && (
          <PredictionPage
            dataMode={dataMode}
            initialLat={selectedLat}
            initialLon={selectedLon}
            initialDate={selectedDate}
            initialDepth={selectedDepth}
          />
        )}

        {currentPage === 'validation' && (
          <ValidationPage
            argoFloats={argoFloats}
          />
        )}

        {currentPage === 'architecture' && (
          <ArchitecturePage />
        )}

        {(currentPage === 'hackathon' || currentPage === 'day-to-day') && (
          <HackathonPage />
        )}

        {(currentPage === 'docs' || currentPage === 'about') && (
          <DocumentationPage />
        )}
      </main>

      {/* 4. Professional Clean Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-6 text-xs text-slate-600 shadow-[0_-1px_3px_rgba(15,23,42,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0284C7] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#0F172A] block">
                ConvFormer 3D Ocean Temperature AI &bull; Bay of Bengal
              </span>
              <span className="text-[11px] text-slate-500">
                0.25° × 0.25° Spatial Grid &bull; In-situ ARGO CTD Ground-Truth Verification
              </span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div className="flex items-center md:justify-end gap-2 text-[11px]">
              <span className="bg-blue-50 text-[#0284C7] font-semibold border border-blue-200 px-2 py-0.5 rounded-full">
                INCOIS &bull; MoES Supported
              </span>
              <span className="badge-real">
                Smart India Hackathon
              </span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-lg">
              Official products: OSTIA SST, Multi-Obs SSS, DUACS SSH, ARGO Profilers. OSCAR/ASCAT/CCMP labeled synthetic demo layers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

