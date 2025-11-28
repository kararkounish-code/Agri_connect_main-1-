import React, { useState, useCallback, useMemo } from 'react';
import { ServiceId, Service, FormData } from './types';
import { SERVICES } from './constants';
import { getAiResponse } from './services/geminiService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import ServiceForm from './components/ServiceForm';
import Loader from './components/Loader';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [activeServiceId, setActiveServiceId] = useState<ServiceId>(ServiceId.PLANT_DOCTOR);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeService = useMemo(() => {
    return SERVICES.find(service => service.id === activeServiceId) as Service;
  }, [activeServiceId]);

  const handleServiceSelect = useCallback((serviceId: ServiceId) => {
    setActiveServiceId(serviceId);
    setResult(null);
    setError(null);
    setSidebarOpen(false);
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getAiResponse(activeServiceId, formData);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // h-[100dvh] ensures full height on mobile browsers with dynamic toolbars
    <div className="flex h-[100dvh] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar 
        activeServiceId={activeServiceId} 
        onSelectService={handleServiceSelect}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <main className="flex-1 flex flex-col relative w-full transition-all duration-300 ease-in-out">
        <Header 
          serviceName={activeService.name} 
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-5xl mx-auto h-full flex flex-col animate-fade-in">
            <div className="mb-6">
               <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2 tracking-tight">{activeService.name}</h2>
               <p className="text-slate-500 text-sm md:text-base">{activeService.description}</p>
            </div>
            
            {activeService.id === ServiceId.PLANT_DOCTOR ? (
              <div className="flex-1 min-h-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                 <ChatInterface />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-5 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-white/50 h-fit transition-all duration-300">
                  <ServiceForm
                    key={activeService.id}
                    service={activeService}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                  {isLoading && (
                    <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-white/40 flex justify-center py-12">
                      <Loader />
                    </div>
                  )}
                  
                  {error && (
                     <div className="w-full bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm animate-slide-up" role="alert">
                       <div className="flex items-center mb-1">
                         <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                         <p className="font-bold">An error occurred</p>
                       </div>
                       <p className="text-sm">{error}</p>
                     </div>
                  )}
                  
                  {result && !isLoading && (
                    <div className="animate-slide-up">
                      <ResultCard result={result} />
                    </div>
                  )}
                  
                  {!result && !isLoading && !error && (
                    <div className="hidden lg:flex flex-col items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                      <activeService.icon className="w-16 h-16 mb-4 opacity-20" />
                      <p>Fill out the form to get AI-powered insights.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;