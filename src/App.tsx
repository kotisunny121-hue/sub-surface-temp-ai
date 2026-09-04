import React, { useState, useEffect } from 'react';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
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
  fetchCcmpData 
} from './services/oceanDataService';
import { ArgoFloat, DataMode } from './types/ocean';
import { Waves, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [dataMode, setDataMode] = useState<DataMode>('real_plus_synthetic');
  
  // Interactive coordinates & parameters
  const [selectedLat, setSelectedLat] = useState<number>(14.0);
  const [selectedLon, setSelectedLon] = useState<number>(88.0);
  const [selectedDate, setSelectedDate] = useState<string>('2020-01-15');
  const [selectedDepth, setSelectedDepth] = useState<number>(100);

  // Loaded ocean dataset states
  const [argoFloats, setArgoFloats] = useState<ArgoFloat[]>([]);
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
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans text-[#1A1A1A] antialiased selection:bg-[#1A1A1A] selection:text-[#FDFCFB]">
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

      {/* 4. Geometric Architectural Footer */}
      <footer className="bg-[#FDFCFB] border-t-2 border-[#1A1A1A] py-8 text-xs text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#1A1A1A] flex items-center justify-center text-white text-[10px] font-bold">
              V
            </div>
            <div>
              <span className="font-bold uppercase tracking-[0.15em] text-[#1A1A1A] block">
                CONVFORMER // OCEAN AI PIPELINE
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#666]">
                GEOMETRIC GRID // 0.25° × 0.25° ISOMETRIC DEPTH DECODER
              </span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div className="flex items-center md:justify-end gap-2 text-[10px] font-mono">
              <span className="bg-[#1A1A1A] text-white px-2 py-0.5">INCOIS &bull; MoES</span>
              <span className="border border-[#1A1A1A] px-2 py-0.5">SIH 2024–26</span>
            </div>
            <p className="text-[11px] text-[#555] max-w-lg">
              Ground truth: Real INCOIS ARGO Floats. OSCAR, ASCAT-C, and CCMP feeds are labeled synthetic demo vectors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

