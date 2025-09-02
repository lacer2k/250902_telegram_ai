import React from 'react';
import { Settings } from '../types';
import { THEMES, BACKGROUNDS } from '../hooks/useSettings';
import { XIcon } from './icons';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsInput: React.FC<{ label: string; id: keyof Settings; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, id, value, onChange }) => (
  <div>
    <label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full bg-gray-600 border border-gray-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, settings, updateSettings }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSettings({ [name]: value });
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-full max-w-sm bg-gray-800 text-white shadow-xl z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Appearance Section */}
            <section>
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-300">Theme</label>
                    <div className="mt-2 flex gap-3">
                        {THEMES.map(theme => (
                            <button key={theme.name} onClick={() => updateSettings({ theme: theme.name })} className={`w-12 h-8 rounded-lg flex items-center justify-center ring-2 ${settings.theme === theme.name ? 'ring-indigo-400' : 'ring-transparent'}`}>
                                <span className={`w-4 h-4 rounded-full ${theme.userBubbleClass}`}></span>
                                <span className={`w-4 h-4 rounded-full ${theme.aiBubbleClass}`}></span>
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-medium text-gray-300">Background</label>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                        {BACKGROUNDS.map(bg => (
                            <button key={bg.name} onClick={() => updateSettings({ backgroundUrl: bg.url })} className={`rounded-lg overflow-hidden ring-2 ${settings.backgroundUrl === bg.url ? 'ring-indigo-400' : 'ring-transparent'}`}>
                                <img src={bg.url} alt={bg.name} className="w-full h-16 object-cover"/>
                            </button>
                        ))}
                    </div>
                </div>
              </div>
            </section>
            
            {/* Personal Details Section */}
            <section>
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Personal Details</h3>
              <div className="space-y-4">
                <SettingsInput label="Display Name" id="displayName" value={settings.displayName} onChange={handleInputChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SettingsInput label="First Name" id="firstName" value={settings.firstName} onChange={handleInputChange} />
                    <SettingsInput label="Last Name" id="lastName" value={settings.lastName} onChange={handleInputChange} />
                </div>
                <SettingsInput label="Email" id="email" value={settings.email} onChange={handleInputChange} />
                <SettingsInput label="Phone Number" id="phone" value={settings.phone} onChange={handleInputChange} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
