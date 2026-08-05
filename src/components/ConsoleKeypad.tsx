import { motion } from 'motion/react';
import { CodelcoButton } from '../types';
import ButtonIconRenderer from './ButtonIconRenderer';

interface ConsoleKeypadProps {
  buttons: CodelcoButton[];
  selectedButtonId: string | null;
  onSelectButton: (button: CodelcoButton) => void;
}

export default function ConsoleKeypad({
  buttons,
  selectedButtonId,
  onSelectButton,
}: ConsoleKeypadProps) {
  
  // Create 5 rows
  const rows = Array.from({ length: 5 }, (_, rowIndex) => {
    const rowNum = rowIndex + 1;
    // Get visible buttons on this row
    return Array.from({ length: 6 }, (__: any, colIndex) => {
      const colNum = colIndex + 1;
      const btn = buttons.find((b) => b.fila === rowNum && b.columna === colNum && b.visible);
      return { fila: rowNum, columna: colNum, button: btn };
    });
  });

  const rowLabels = [
    'Fila 1: Tracción y Bloqueos de Diferencial',
    'Fila 2: Dirección Auxiliar y Freno de Servicio',
    'Fila 3: Suspensión Hidráulica y Tolva',
    'Fila 4: Alarmas de Chasis y Depósitos',
    'Fila 5: Filtros de Combustible y Ventiladores',
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in" id="console-keypad-root">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-100 tracking-wider uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F7A600] animate-pulse" />
            Consola de Mandos Física (Simulador de Cabina)
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Matriz de 5 filas x 6 columnas idéntica al tablero de control físico de la maquinaria pesada CODELCO.
          </p>
        </div>
        
        {/* Type Legend / Prioridad */}
        <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-wider">
          <div className="flex items-center gap-1.5 bg-[#1C1212] px-2.5 py-1 rounded border border-red-900/40 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            CRÍTICA
          </div>
          <div className="flex items-center gap-1.5 bg-[#1C1712] px-2.5 py-1 rounded border border-orange-950 text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7A600]" />
            ALTA
          </div>
          <div className="flex items-center gap-1.5 bg-[#12171C] px-2.5 py-1 rounded border border-blue-900/40 text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            MEDIA / BAJA
          </div>
        </div>
      </div>

      {/* Main Console Box */}
      <div className="bg-[#0E0E10] border-4 border-zinc-900 rounded-2xl p-4 md:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.7)] space-y-6">
        <div className="space-y-6 md:space-y-8">
          {rows.map((rowCells, rowIndex) => (
            <div key={rowIndex} className="space-y-2">
              <div className="flex justify-between items-center px-1 border-b border-zinc-800/50 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
                  {rowLabels[rowIndex]}
                </span>
                <span className="text-[9px] text-zinc-600 font-mono">
                  R{rowIndex + 1} • C1-C6
                </span>
              </div>

              {/* 6 column grid for this row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {rowCells.map((cell, colIndex) => {
                  const btn = cell.button;
                  const isSelected = btn && selectedButtonId === btn.id;

                  if (!btn) {
                    return (
                      <div 
                        key={`${rowIndex}-${colIndex}`}
                        className="bg-[#070709] border border-zinc-900 rounded-xl min-h-[105px] flex items-center justify-center relative shadow-inner"
                      >
                        <div className="absolute inset-1.5 border border-zinc-950 rounded-lg pointer-events-none" />
                        <span className="text-[9px] font-mono text-zinc-800 tracking-wider">SLOT VACÍO</span>
                      </div>
                    );
                  }

                  const priority = btn.datosTecnicos?.prioridad || 'Media';
                  const priorityColor = 
                    priority === 'Crítica' ? 'border-red-600' :
                    priority === 'Alta' ? 'border-[#F7A600]' : 'border-zinc-700';

                  return (
                    <motion.button
                      key={btn.id}
                      onClick={() => btn.activo && onSelectButton(btn)}
                      whileHover={btn.activo ? { scale: 1.02, y: -2 } : {}}
                      whileTap={btn.activo ? { scale: 0.98, y: 0 } : {}}
                      className={`relative flex flex-col items-center justify-between p-3.5 rounded-xl border text-center transition-all duration-200 min-h-[110px] select-none focus:outline-none ${
                        isSelected
                          ? 'bg-zinc-900 border-[#F7A600] text-[#F7A600] shadow-[0_0_15px_rgba(247,166,0,0.35)] z-20'
                          : btn.activo
                            ? 'bg-[#151518] border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-[#1C1C20] cursor-pointer'
                            : 'bg-[#0E0E10] border-zinc-950 text-zinc-600 opacity-30 cursor-not-allowed'
                      }`}
                      style={{
                        borderTopWidth: btn.activo ? '3px' : '1px',
                        borderTopColor: isSelected ? '#F7A600' : btn.color || '#C87533'
                      }}
                      id={`pad-btn-${btn.id}`}
                    >
                      {/* Grid Position Label */}
                      <span className="absolute top-1 right-2 text-[8px] font-bold font-mono text-zinc-600">
                        {rowIndex + 1}-{colIndex + 1}
                      </span>

                      {/* Small tactile LED circle indicator */}
                      <div className="absolute top-1 left-2">
                        <span className={`w-1.5 h-1.5 rounded-full block ${
                          isSelected 
                            ? 'bg-[#F7A600] animate-pulse shadow-[0_0_6px_#F7A600]' 
                            : btn.activo 
                              ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]' 
                              : 'bg-zinc-800'
                        }`} />
                      </div>

                      {/* Icon */}
                      <div className="mt-2.5 mb-1 flex items-center justify-center">
                        <ButtonIconRenderer
                          tipo={btn.icono.tipo}
                          valor={btn.icono.valor}
                          className={`w-6 h-6 ${isSelected ? 'animate-pulse' : ''}`}
                          color={isSelected ? '#F7A600' : btn.color || '#A0A0AB'}
                        />
                      </div>

                      {/* Button Label */}
                      <span className="text-[10px] font-bold tracking-tight leading-none uppercase font-mono max-w-full truncate px-0.5 mt-1">
                        {btn.nombre}
                      </span>

                      {/* Tiny Action Badge */}
                      <div className="mt-1 flex items-center justify-center gap-1">
                        <span className="text-[7px] uppercase tracking-widest font-mono text-zinc-500 scale-90">
                          {isSelected ? 'ACTIVO' : 'MANDO'}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
