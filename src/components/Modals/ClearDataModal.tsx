import React, { useState } from 'react';
import { Trash2, AlertTriangle, RefreshCw, CheckCircle2, Database, ShieldAlert, X } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface ClearDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const ClearDataModal: React.FC<ClearDataModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [clearedSuccess, setClearedSuccess] = useState(false);
  const [restoredSuccess, setRestoredSuccess] = useState(false);
  const isCleared = storageService.isDemoCleared();
  const supabaseConfig = storageService.getSupabaseConfig();

  if (!isOpen) return null;

  const handleClearDemoData = () => {
    storageService.clearAllDemoData();
    setClearedSuccess(true);
    setRestoredSuccess(false);
    setTimeout(() => {
      onDataChanged();
      onClose();
      setClearedSuccess(false);
    }, 1200);
  };

  const handleRestoreDemoData = () => {
    storageService.restoreDemoData();
    setRestoredSuccess(true);
    setClearedSuccess(false);
    setTimeout(() => {
      onDataChanged();
      onClose();
      setRestoredSuccess(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Trash2 className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Gestión de Datos y Limpieza</h3>
              <p className="text-xs text-slate-300">Borrar datos de muestra y preparación de base de datos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {clearedSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">¡Datos de muestra eliminados exitosamente!</p>
                <p className="text-xs text-emerald-700 mt-1">
                  El navegador ha guardado tu preferencia y ya no mostrará registros ficticios al recargar la página.
                </p>
              </div>
            </div>
          ) : restoredSuccess ? (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 animate-spin" />
              <div>
                <p className="text-sm font-semibold">Datos de prueba restaurados</p>
                <p className="text-xs text-blue-700 mt-1">
                  Se han restablecido los socios de muestra (Roberto Montes, Mariana, etc.) para pruebas de demostración.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-semibold block text-sm text-amber-950 mb-0.5">
                    ¿Deseas vaciar los datos de demostración?
                  </span>
                  Esta acción eliminará todos los socios, registros de visitas, reservas de clases y pagos de muestra del navegador. 
                  <strong className="block mt-1 font-semibold text-amber-950">
                    La preferencia quedará almacenada para que el sistema inicie limpio y no vuelva a cargar datos de prueba automáticamente.
                  </strong>
                </div>
              </div>

              {/* Supabase status integration */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-1.5 font-semibold text-[#1D3A4C]">
                    <Database className="w-4 h-4 text-[#B4901E]" />
                    Conexión con Supabase (Base de Datos en la Nube):
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    supabaseConfig.isConnected 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {supabaseConfig.isConnected ? 'Conectado a Producción' : 'Modo Almacenamiento Local (Listo)'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cuando vincules tus credenciales de Supabase en Ajustes, el sistema sincronizará los socios reales directamente y podrás ejecutar la limpieza de tablas remotas con un solo clic.
                </p>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <span>Estado actual del sistema: <strong>{isCleared ? 'Limpio (Sin datos de muestra)' : 'Con datos de prueba activos'}</strong></span>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={onClose}
              disabled={clearedSuccess || restoredSuccess}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>

            {isCleared ? (
              <button
                onClick={handleRestoreDemoData}
                disabled={clearedSuccess || restoredSuccess}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D3A4C] text-white text-xs font-semibold hover:bg-[#152a37] transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4 text-[#B4901E]" />
                Restaurar Datos de Demostración
              </button>
            ) : (
              <button
                onClick={handleClearDemoData}
                disabled={clearedSuccess || restoredSuccess}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-all shadow-sm shadow-rose-200"
              >
                <Trash2 className="w-4 h-4" />
                Confirmar y Vaciar Datos de Muestra
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
