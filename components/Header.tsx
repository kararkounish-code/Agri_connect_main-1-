import React from 'react';

interface HeaderProps {
  serviceName: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ serviceName, onMenuClick }) => {
  return (
    <header className="flex-shrink-0 bg-white/70 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between lg:hidden sticky top-0 z-20 transition-all">
      <div className="flex items-center">
         <div className="bg-emerald-100 p-1.5 rounded-lg mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21.5V19M12 19c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
            </svg>
         </div>
         <h1 className="text-lg font-bold text-emerald-900 tracking-tight">AgriConnect</h1>
      </div>
      <button 
        onClick={onMenuClick} 
        className="p-2 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </header>
  );
};

export default Header;