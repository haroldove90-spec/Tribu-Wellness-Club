import React, { useState } from 'react';
import { Database, Key, Server, Check, X, ShieldCheck, Trash2 } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataCleared?: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onDataCleared,
}) => {
  const currentConfig = storageService.getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [saved, setSaved] = useState(false);
  const [remoteWiped, setRemoteWiped] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isConn = url.trim().length > 0 && anonKey.trim().length > 0;
    storageService.saveSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      isConnected: isConn,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleWipeRemote = () => {
    storageService.clearAllDemoData();
    setRemoteWiped(true);
    if (onDataCleared) onDataCleared();
    setTimeout(() => {
      setRemoteWiped(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#1D3A4C] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#B4901E]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Configuración de Supabase</h3>
              <p className="text-xs text-slate-300">Persistencia PostgreSQL y borrado de registros en la nube</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            Puedes conectar tu proyecto de <span className="font-semibold text-slate-900">Supabase</span> para sincronizar los socios, visitas y reservas en tiempo real. Si aún no tienes proyecto, el sistema opera con almacenamiento local seguro en el navegador.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project URL (Endpoint de Supabase)
            </label>
            <div className="relative">
              <Server className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C] focus:border-transparent font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Anon / Public API Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1D3A4C] focus:border-transparent font-mono"
              />
            </div>
          </div>

          {/* Wipe button for Supabase / Cloud records */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900">Borrar Registros de Nube / Demo</p>
                <p className="text-[11px] text-slate-500">Limpia las tablas para comenzar producción desde cero</p>
              </div>
              <button
                type="button"
                onClick={handleWipeRemote}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {remoteWiped ? '¡Tablas Vaciadas!' : 'Vaciar Tablas'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1D3A4C] text-white text-xs font-semibold hover:bg-[#152a37] shadow-sm transition"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Guardado
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#B4901E]" />
                  Guardar Conexión
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
