import React, { useState, useMemo, FormEvent } from 'react';
import { Service, FormField, FormData } from '../types';

interface ServiceFormProps {
  service: Service;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

const InputWrapper: React.FC<{ children: React.ReactNode; label: string; id: string; required?: boolean; unit?: string }> = ({ children, label, id, required, unit }) => (
  <div className="group">
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-emerald-600">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      {children}
      {unit && (
        <span className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-400 bg-transparent">
          {unit}
        </span>
      )}
    </div>
  </div>
);

const renderField = (field: FormField, value: string | number, onChange: (id: string, value: string | number) => void) => {
  const commonInputClasses = "block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white sm:text-sm hover:border-emerald-300/50";

  switch (field.type) {
    case 'select':
      return (
        <div className="relative">
          <select
            id={field.id}
            value={value as string}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
            className={`${commonInputClasses} appearance-none`}
          >
            <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
             <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      );
    case 'number':
      return (
        <input
            type="number"
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={`${commonInputClasses} ${field.unit ? 'pr-12' : ''}`}
        />
      );
    case 'text':
    default:
      return (
        <input
            type="text"
            id={field.id}
            value={value as string}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={`${commonInputClasses} ${field.unit ? 'pr-12' : ''}`}
        />
      );
  }
};

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSubmit, isLoading }) => {
  const initialFormState = useMemo(() => service.fields.reduce((acc, field) => {
    acc[field.id] = '';
    return acc;
  }, {} as FormData), [service]);

  const [formData, setFormData] = useState<FormData>(initialFormState);

  React.useEffect(() => {
    setFormData(initialFormState);
  }, [initialFormState]);

  const handleChange = (id: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        {service.fields.map(field => (
          <InputWrapper key={field.id} label={field.label} id={field.id} required={field.required} unit={field.unit}>
            {renderField(field, formData[field.id] ?? '', handleChange)}
          </InputWrapper>
        ))}
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-3.5 px-6 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Get Recommendation
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;