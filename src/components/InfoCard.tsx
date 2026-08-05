import { motion } from 'motion/react';
import { CodelcoButton } from '../types';
import { AlertTriangle, Shield, Calendar, Info, ArrowLeft, Settings, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

interface InfoCardProps {
  button: CodelcoButton | null;
  onClose: () => void;
}

export default function InfoCard({ button, onClose }: InfoCardProps) {
  if (!button) return null;

  const priorityColors = {
    'Crítica': { bg: 'bg-red-950/40', border: 'border-red-600/50', text: 'text-red-400', badge: 'bg-red-500' },
    'Alta': { bg: 'bg-orange-950/40', border: 'border-orange-500/50', text: 'text-orange-400', badge: 'bg-[#F7A600]' },
    'Media': { bg: 'bg-yellow-950/20', border: 'border-yellow-600/30', text: 'text-yellow-400', badge: 'bg-yellow-500' },
    'Baja': { bg: 'bg-zinc-800/40', border: 'border-zinc-700/50', text: 'text-zinc-400', badge: 'bg-zinc-600' }
  };

  const priorityStyle = priorityColors[button.datosTecnicos?.prioridad || 'Media'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      transition={{ type: 'spring', damping: 24, stiffness: 140 }}
      className="w-full max-w-xl bg-[#121215] border-2 border-zinc-800 rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-zinc-100"
      id={`infocard-${button.id}`}
    >
      {/* Premium Metallic Copper Accent Strip */}
      <div className="h-2 w-full bg-gradient-to-r from-[#C87533] via-[#F7A600] to-[#C87533]" />

      {/* Header Container */}
      <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
        {/* Badges & Meta Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Section/Category Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold uppercase tracking-widest text-[#C87533]">
            <Settings className="w-3.5 h-3.5" />
            {button.categoria || 'SISTEMA'}
          </div>

          {/* Technical Priority Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border ${priorityStyle.bg} ${priorityStyle.border} ${priorityStyle.text} text-[10px] font-mono font-bold uppercase tracking-widest`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.badge} animate-pulse`} />
            PRIORIDAD: {button.datosTecnicos?.prioridad || 'MEDIA'}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
            ID MANDO: {button.id}
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-tight uppercase font-sans border-b border-zinc-800/80 pb-3">
            {button.nombre}
          </h2>
        </div>

        {/* Dynamic Image Box */}
        {button.imagen && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center group">
            <img
              src={button.imagen}
              alt={button.nombre}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // If path is broken, hide the broken icon or replace with fallback
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Subtle copper border highlight */}
            <div className="absolute inset-0 border border-[#C87533]/20 rounded-xl pointer-events-none group-hover:border-[#C87533]/40 transition-colors" />
          </div>
        )}

        {/* Technical Data Fields Grid */}
        <div className="grid grid-cols-2 gap-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-zinc-500 text-[9px] uppercase tracking-wider block">Sistema Operativo</span>
            <span className="text-zinc-200 font-bold uppercase">{button.datosTecnicos?.sistema || 'N/A'}</span>
          </div>
          <div className="space-y-1 border-l border-zinc-900 pl-4">
            <span className="text-zinc-500 text-[9px] uppercase tracking-wider block">Componente Físico</span>
            <span className="text-zinc-200 font-bold uppercase">{button.datosTecnicos?.componente || 'N/A'}</span>
          </div>
        </div>

        {/* Specifications List */}
        <div className="space-y-5">
          {/* Descripción */}
          {button.descripcion && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#C87533] flex items-center gap-1.5 font-mono">
                <Info className="w-4 h-4 text-[#C87533]" />
                Descripción General
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {button.descripcion}
              </p>
            </div>
          )}

          {/* ¿Qué hace? */}
          {button.queHace && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#C87533] flex items-center gap-1.5 font-mono">
                <HelpCircle className="w-4 h-4 text-[#C87533]" />
                Acción del Dispositivo (¿Qué hace?)
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans bg-zinc-950/40 p-4 rounded-xl border border-zinc-900/50">
                {button.queHace}
              </p>
            </div>
          )}

          {/* ¿Cuándo se utiliza? */}
          {button.cuandoSeUtiliza && (
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#C87533] flex items-center gap-1.5 font-mono">
                <Calendar className="w-4 h-4 text-[#C87533]" />
                Condición de Uso (¿Cuándo se utiliza?)
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {button.cuandoSeUtiliza}
              </p>
            </div>
          )}

          {/* Advertencia Box */}
          {button.advertencia && (
            <div className="p-4 bg-red-950/30 border-l-4 border-red-500 rounded-r-xl space-y-1.5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-400 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                ADVERTENCIA DE SEGURIDAD
              </h3>
              <p className="text-xs text-red-200 leading-relaxed font-sans font-medium">
                {button.advertencia}
              </p>
            </div>
          )}

          {/* Protocolo de Operación */}
          {button.protocolo && button.protocolo.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#C87533] flex items-center gap-1.5 font-mono">
                <FileText className="w-4 h-4 text-[#C87533]" />
                Protocolo de Operación Estándar (SOP)
              </h3>
              <div className="space-y-2.5">
                {button.protocolo.map((step, sIdx) => (
                  <div key={sIdx} className="flex gap-3 items-start bg-zinc-950/20 border border-zinc-900/60 p-3 rounded-xl">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F7A600]/10 border border-[#F7A600]/30 flex items-center justify-center text-[#F7A600] text-xs font-mono font-bold">
                      {sIdx + 1}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer controls */}
      <div className="px-6 py-4 md:px-8 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between">
        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
          Codelco División Norte
        </span>
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-[#C87533] hover:bg-[#D88543] text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
          id="btn-return-panel"
        >
          <ArrowLeft className="w-4 h-4" />
          VOLVER AL PANEL
        </button>
      </div>
    </motion.div>
  );
}
