import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CodelcoButton, CodelcoPanel } from './types';
import { fetchButtons, fetchPanel, saveAllButtons, savePanel } from './services/firebase';
import { defaultCodelcoButtons } from './data/defaultButtons';
import PanelViewer from './components/PanelViewer';
import InfoCard from './components/InfoCard';
import ConsoleKeypad from './components/ConsoleKeypad';
import VisualEditor from './components/VisualEditor';
import { Shield, Sparkles, Sliders, Database, Eye, Info, RefreshCw, HardHat } from 'lucide-react';

// Custom Authentic SVG CODELCO Logo Component
function CodelcoLogo({ className = "h-9" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`} id="codelco-logo">
      <svg viewBox="0 0 120 120" className="w-10 h-10 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Main Codelco Copper-Orange Square */}
        <rect width="120" height="120" rx="20" fill="#F7A600" />
        {/* The stylized "C" in white */}
        <path d="M 90 32 A 38 38 0 1 0 90 88" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" fill="none" />
        {/* The slanted metallic copper bar in center */}
        <path d="M 48 72 L 85 35" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" />
        <path d="M 48 72 L 85 35" stroke="#E5E7EB" strokeWidth="10" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col text-left">
        <span className="text-[20px] font-black tracking-tighter text-white leading-none">CODELCO</span>
        <span className="text-[8.5px] font-bold tracking-[0.22em] text-[#C87533] uppercase leading-none mt-1">
          Corporación del Cobre
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [buttons, setButtons] = useState<CodelcoButton[]>([]);
  const [panelConfig, setPanelConfig] = useState<CodelcoPanel | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const isFirstRender = useRef(true);

  // Load from Firebase on Mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [fetchedButtons, fetchedConfig] = await Promise.all([
          fetchButtons(),
          fetchPanel()
        ]);

        setPanelConfig(fetchedConfig);

        if (fetchedButtons && fetchedButtons.length > 0) {
          setButtons(fetchedButtons);
        } else {
          // If remote DB is empty, seed it with default Codelco buttons automatically!
          console.log('Database empty. Seeding Codelco heavy machinery default layout...');
          setButtons(defaultCodelcoButtons);
          await saveAllButtons(defaultCodelcoButtons);
        }
      } catch (err) {
        console.error('Failed to contact Firebase, loading local offline mode:', err);
        // Offline Fallback for robust operations
        setButtons(defaultCodelcoButtons);
        setPanelConfig({
          filas: 5,
          columnas: 6,
          empresa: 'CODELCO',
          logo: '/logos/codelco.png',
          titulo: 'MUSEO INTERACTIVO DE SIMBOLOGÍA INDUSTRIAL'
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Debounced Auto-Saver for visual updates
  useEffect(() => {
    // Avoid saving on initial load
    if (loading || isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    const delayDebounce = setTimeout(async () => {
      const success = await saveAllButtons(buttons);
      if (success) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    }, 1200); // 1.2 second debounce to bundle fast consecutive updates while typing

    return () => clearTimeout(delayDebounce);
  }, [buttons, loading]);

  const selectedButton = buttons.find((b) => b.id === selectedButtonId) || null;

  const handleSelectButton = (button: CodelcoButton) => {
    if (button.activo) {
      setSelectedButtonId(button.id);
    }
  };

  const handleDeselect = () => {
    setSelectedButtonId(null);
  };

  // Callback to update local state in real-time from the visual editor
  const handleUpdateButtonsFromEditor = (updatedList: CodelcoButton[]) => {
    setButtons(updatedList);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#08080A] text-zinc-200 flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#C87533] border-t-transparent rounded-full animate-spin" />
          <div className="absolute w-6 h-6 border-4 border-[#F7A600] border-b-transparent rounded-full animate-spin reverse-spin" />
        </div>
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F7A600] animate-pulse">
            Sincronizando con Servidor CODELCO...
          </span>
          <p className="text-[10px] text-zinc-500 font-mono">ESTABLECIENDO ENLACE SEGURO CON FIREBASE REALTIME DATABASE</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#08080A] text-zinc-200 flex flex-col justify-between overflow-x-hidden relative font-sans">
      
      {/* Matte Industrial Background grids */}
      <div className="absolute inset-0 bg-[#0C0C0E] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#0A0A0C] to-[#050507] pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Top Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6 z-10 border-b border-zinc-900/60">
        
        {/* Left Codelco Identity */}
        <CodelcoLogo />

        {/* Center Title / Subtitle */}
        <div className="text-center md:text-left space-y-1.5 md:pl-6 md:border-l border-zinc-900">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-mono font-bold tracking-widest text-[#F7A600] uppercase">
            <Shield className="w-3.5 h-3.5" />
            Museo Interactivo de Cabina
          </div>
          <h1 className="text-md sm:text-lg font-black text-white tracking-wide uppercase font-mono">
            {panelConfig?.titulo || 'DASHBOARD DE SIMBOLOGÍA Y MANDOS DE SEGURIDAD'}
          </h1>
          <p className="text-[10px] sm:text-xs text-zinc-500 max-w-xl font-medium">
            Entrenamiento de operadores para camiones CAEX de alto tonelaje. Seleccione mandos para verificar protocolos operativos de seguridad.
          </p>
        </div>
        
        {/* Right Admin Interface Actions */}
        <div className="flex items-center gap-3">
          {/* Editor Mode Switch */}
          <button
            onClick={() => {
              setEditMode(!editMode);
              handleDeselect(); // Close active tooltip if switching views
            }}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all active:scale-95 cursor-pointer ${
              editMode
                ? 'bg-zinc-900 border-[#F7A600] text-[#F7A600]'
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300'
            }`}
            id="btn-toggle-editor"
          >
            {editMode ? (
              <>
                <Eye className="w-4 h-4" />
                Modo Explorador
              </>
            ) : (
              <>
                <Sliders className="w-4 h-4 text-[#F7A600]" />
                Modo Editor (Visual)
              </>
            )}
          </button>
          
          <div className="hidden lg:flex flex-col text-right font-mono text-[9px] text-zinc-600 uppercase">
            <span>Servidor: En Línea</span>
            <span>BDB: panel-control-codelco</span>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 z-10 flex flex-col gap-10">
        <AnimatePresence mode="wait">
          {editMode ? (
            // VIEW A: Visual Editor Admin panel
            <motion.div
              key="editor-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <VisualEditor
                buttons={buttons}
                onUpdateButtons={handleUpdateButtonsFromEditor}
                onClose={() => setEditMode(false)}
                saveStatus={saveStatus}
              />
            </motion.div>
          ) : (
            // VIEW B: Interactive Museum Stage
            <motion.div
              key="museum-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <AnimatePresence mode="wait">
                {!selectedButton ? (
                  // Normal panel view
                  <motion.div
                    key="standard-panel"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.99 }}
                    transition={{ duration: 0.35 }}
                    className="w-full flex flex-col items-center justify-center gap-6"
                  >
                    <PanelViewer
                      buttons={buttons}
                      selectedButtonId={selectedButtonId}
                      onSelectButton={handleSelectButton}
                    />
                    <div className="text-center space-y-1 py-1">
                      <span className="text-[10px] font-mono font-black text-[#F7A600] tracking-widest uppercase flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        TABLERO DE SUPERVISIÓN CENTRAL
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        Presione cualquier componente o utilice la consola física a continuación para desplegar la información de ingeniería.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  // Zoomed layout view
                  <motion.div
                    key="zoomed-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-10"
                  >
                    {/* Left Frame: Focused Zoomed button grid */}
                    <div className="w-full lg:w-[52%] flex justify-center">
                      <PanelViewer
                        buttons={buttons}
                        selectedButtonId={selectedButtonId}
                        onSelectButton={handleSelectButton}
                      />
                    </div>

                    {/* Right Frame: Standard SOP Info Card */}
                    <div className="w-full lg:w-[48%] flex justify-center">
                      <InfoCard
                        button={selectedButton}
                        onClose={handleDeselect}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom physical controls simulator keypad */}
              <div className="w-full border-t border-zinc-900/80 pt-10">
                <ConsoleKeypad
                  buttons={buttons}
                  selectedButtonId={selectedButtonId}
                  onSelectButton={handleSelectButton}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Industrial Footer */}
      <footer className="w-full py-6 text-center text-[9px] text-zinc-600 font-mono tracking-widest z-10 border-t border-zinc-900/60 bg-black/40 flex flex-col sm:flex-row items-center justify-between px-6 gap-3">
        <div className="flex items-center gap-1 text-zinc-500">
          <HardHat className="w-3.5 h-3.5 text-[#F7A600]" />
          <span>SISTEMA DE ENTRENAMIENTO CAEX • DIVISIÓN GABRIELA MISTRAL</span>
        </div>
        <span className="uppercase">CODELCO ORGULLO DE TODOS LOS CHILENOS • © 2026</span>
      </footer>

    </div>
  );
}
