import React from 'react';
import { ServiceId } from '../types';
import { SERVICES } from '../constants';

interface SidebarProps {
  activeServiceId: ServiceId;
  onSelectService: (serviceId: ServiceId) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeServiceId, onSelectService, isOpen, setIsOpen }) => {
  const sidebarClasses = `
    fixed lg:static inset-y-0 left-0 z-40
    transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
    transition-transform duration-300 ease-in-out cubic-bezier(0.4, 0, 0.2, 1)
    bg-gradient-to-b from-emerald-900 to-teal-950
    w-72 text-white flex-shrink-0 flex flex-col shadow-2xl lg:shadow-none
    border-r border-emerald-800/50
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={sidebarClasses}>
        <div className="flex items-center p-6 border-b border-emerald-800/50 bg-emerald-900/50">
          <div className="bg-emerald-500/20 p-2 rounded-lg mr-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21.5V19M12 19c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
             </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">AgriConnect</h1>
            <p className="text-xs text-emerald-300 uppercase tracking-widest font-medium">Smart Farming</p>
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setIsOpen(false)} className="ml-auto lg:hidden text-emerald-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Services
          </div>
          {SERVICES.map((service) => {
             const isActive = activeServiceId === service.id;
             return (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className={`w-full flex items-center px-4 py-3.5 text-left rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/20 border border-emerald-500/30'
                    : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <service.icon className={`h-5 w-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-emerald-400 group-hover:text-white'}`} />
                <span className="font-medium">{service.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-emerald-800/50 bg-emerald-900/30">
          <div className="flex items-center space-x-3">
             <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center text-emerald-900 font-bold text-xs">
                AC
             </div>
             <div>
               <p className="text-sm font-medium text-white">User Session</p>
               <p className="text-xs text-emerald-300">Connected</p>
             </div>
          </div>
          <div className="mt-4 text-center">
             <p className="text-[10px] text-emerald-500/70 uppercase tracking-widest">&copy; by ~ Kounish Karar</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;