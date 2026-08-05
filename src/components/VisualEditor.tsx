import React, { useState, useEffect, useRef } from 'react';
import { CodelcoButton, ButtonIcon, ButtonDatosTecnicos } from '../types';
import ButtonIconRenderer, { POPULAR_LUCIDE_ICONS } from './ButtonIconRenderer';
import { 
  Search, Plus, Copy, Trash2, ArrowUp, ArrowDown, Save, X, Eye, 
  Upload, Sparkles, Check, AlertTriangle, HelpCircle, Layers, Settings, FileText, ChevronUp, ChevronDown 
} from 'lucide-react';

interface VisualEditorProps {
  buttons: CodelcoButton[];
  onUpdateButtons: (updatedButtons: CodelcoButton[]) => void;
  onClose: () => void;
  saveStatus: 'saved' | 'saving' | 'error';
}

const CATEGORY_PRESETS = [
  'Tracción y Potencia',
  'Motor',
  'Sistema Hidráulico',
  'Seguridad',
  'Iluminación',
  'Transmisión',
  'Frenos',
  'Dirección',
  'Cabina',
  'Filtros'
];

const COLOR_PRESETS = [
  { name: 'Naranjo Codelco', value: '#F7A600' },
  { name: 'Cobre Metálico', value: '#C87533' },
  { name: 'Rojo Alarma', value: '#D32F2F' },
  { name: 'Azul Hidráulico', value: '#1976D2' },
  { name: 'Verde Operación', value: '#388E3C' },
  { name: 'Amarillo Alerta', value: '#FBC02D' },
  { name: 'Gris Neutro', value: '#71717A' },
  { name: 'Negro Mate', value: '#18181B' }
];

const EMOJI_PRESETS = ['⚙️', '🚨', '💡', '🔋', '🌡️', '⚠️', '🔧', '🚜', '🛑', '📡', '🔥', '💧', '🛡️', '🔔'];

export default function VisualEditor({
  buttons,
  onUpdateButtons,
  onClose,
  saveStatus
}: VisualEditorProps) {
  // Selected button in editor
  const [selectedId, setSelectedId] = useState<string | null>(buttons[0]?.id || null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchPriority, setSearchPriority] = useState('');

  // Active form section tab
  const [activeTab, setActiveTab] = useState<'design' | 'technical' | 'protocol'>('design');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedButton = buttons.find(b => b.id === selectedId) || null;

  // Search filter matching
  const filteredButtons = buttons.filter(b => {
    const matchText = searchTerm.toLowerCase();
    const idMatch = b.id.toLowerCase().includes(matchText);
    const nameMatch = b.nombre.toLowerCase().includes(matchText);
    const descMatch = (b.descripcion || '').toLowerCase().includes(matchText);
    const systemMatch = (b.datosTecnicos?.sistema || '').toLowerCase().includes(matchText);
    const compMatch = (b.datosTecnicos?.componente || '').toLowerCase().includes(matchText);
    
    const textMatches = idMatch || nameMatch || descMatch || systemMatch || compMatch;
    const catMatches = !searchCategory || b.categoria === searchCategory;
    const prioMatches = !searchPriority || b.datosTecnicos?.prioridad === searchPriority;
    
    return textMatches && catMatches && prioMatches;
  });

  // Unique ID generator
  const generateNewId = () => {
    const numericIds = buttons
      .map(b => parseInt(b.id.replace('btn-', ''), 10))
      .filter(n => !isNaN(n));
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    const nextIdStr = String(maxId + 1).padStart(3, '0');
    return `btn-${nextIdStr}`;
  };

  // Create Button
  const handleCreateButton = () => {
    const newId = generateNewId();
    const newButton: CodelcoButton = {
      id: newId,
      nombre: 'Nuevo Mando Industrial',
      fila: 1,
      columna: 1,
      orden: buttons.length + 1,
      activo: true,
      visible: true,
      categoria: 'Tracción y Potencia',
      color: '#F7A600',
      icono: {
        tipo: 'lucide',
        valor: 'Settings'
      },
      imagen: '',
      descripcion: 'Descripción técnica del nuevo dispositivo de control.',
      queHace: 'Detalla qué sucede mecánicamente al accionar este mando.',
      cuandoSeUtiliza: 'Especifica la condición operacional obligatoria.',
      advertencia: '',
      protocolo: ['Paso 1: Detener equipo.', 'Paso 2: Accionar el interruptor.'],
      datosTecnicos: {
        sistema: 'Sistemas Auxiliares',
        componente: 'Panel Digital',
        prioridad: 'Media'
      }
    };

    const newButtons = [...buttons, newButton];
    onUpdateButtons(newButtons);
    setSelectedId(newId);
  };

  // Duplicate Button
  const handleDuplicateButton = () => {
    if (!selectedButton) return;
    const newId = generateNewId();
    const duplicated: CodelcoButton = {
      ...selectedButton,
      id: newId,
      nombre: `${selectedButton.nombre} (Copia)`,
      orden: buttons.length + 1
    };
    
    const newButtons = [...buttons, duplicated];
    onUpdateButtons(newButtons);
    setSelectedId(newId);
  };

  // Delete Button
  const handleDeleteButton = () => {
    if (!selectedButton) return;
    if (confirm(`¿Está seguro de eliminar permanentemente el mando ${selectedButton.id}: ${selectedButton.nombre}?`)) {
      const remaining = buttons.filter(b => b.id !== selectedButton.id);
      onUpdateButtons(remaining);
      setSelectedId(remaining[0]?.id || null);
    }
  };

  // Form Change Handler
  const handleFieldChange = (field: keyof CodelcoButton, value: any) => {
    if (!selectedButton) return;
    const updated = { ...selectedButton, [field]: value };
    const newButtons = buttons.map(b => b.id === selectedButton.id ? updated : b);
    onUpdateButtons(newButtons);
  };

  // Nested object handlers
  const handleIconChange = (iconField: keyof ButtonIcon, value: string) => {
    if (!selectedButton) return;
    const updatedIcon = { ...selectedButton.icono, [iconField]: value };
    handleFieldChange('icono', updatedIcon);
  };

  const handleTechChange = (techField: keyof ButtonDatosTecnicos, value: string) => {
    if (!selectedButton) return;
    const updatedTech = { ...selectedButton.datosTecnicos, [techField]: value };
    handleFieldChange('datosTecnicos', updatedTech);
  };

  // Protocol list builders
  const handleAddProtocolStep = () => {
    if (!selectedButton) return;
    const currentProtocol = selectedButton.protocolo || [];
    const updatedProtocol = [...currentProtocol, 'Nuevo paso operacional...'];
    handleFieldChange('protocolo', updatedProtocol);
  };

  const handleEditProtocolStep = (index: number, val: string) => {
    if (!selectedButton) return;
    const updatedProtocol = [...(selectedButton.protocolo || [])];
    updatedProtocol[index] = val;
    handleFieldChange('protocolo', updatedProtocol);
  };

  const handleDeleteProtocolStep = (index: number) => {
    if (!selectedButton) return;
    const updatedProtocol = (selectedButton.protocolo || []).filter((_, i) => i !== index);
    handleFieldChange('protocolo', updatedProtocol);
  };

  const handleMoveProtocolStep = (index: number, direction: 'up' | 'down') => {
    if (!selectedButton) return;
    const protocol = [...(selectedButton.protocolo || [])];
    if (direction === 'up' && index > 0) {
      const temp = protocol[index];
      protocol[index] = protocol[index - 1];
      protocol[index - 1] = temp;
    } else if (direction === 'down' && index < protocol.length - 1) {
      const temp = protocol[index];
      protocol[index] = protocol[index + 1];
      protocol[index + 1] = temp;
    }
    handleFieldChange('protocolo', protocol);
  };

  // Image base64 uploader helper (includes client-side compression to keep payload tiny)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Render on canvas to compress and resize
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 480;
        const MAX_HEIGHT = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to high-compression WebP or JPEG
        const base64Str = canvas.toDataURL('image/jpeg', 0.7);
        handleFieldChange('imagen', base64Str);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    handleFieldChange('imagen', '');
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#0C0C0E] border-2 border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_32px_80px_rgba(0,0,0,0.9)] text-zinc-200">
      
      {/* 1. Sidebar Panel Lateral (List & Filters) */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-900 bg-[#0F0F12] flex flex-col flex-shrink-0">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-[#F7A600]" />
              ADMINISTRACIÓN
            </span>
            {/* Status Indicator */}
            <div className="flex items-center gap-1.5 text-[9px] font-mono">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-[#F7A600] uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F7A600] animate-ping" />
                  Sincronizando...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-green-400 font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Al Día
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center gap-1 text-red-500 font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  Falla de Red
                </span>
              )}
            </div>
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Mandos en Base de Datos
          </h3>

          {/* Quick Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar por ID, nombre, sistema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#F7A600] font-mono"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-[10px] text-zinc-400 font-mono focus:outline-none"
              >
                <option value="">Todas Categorías</option>
                {CATEGORY_PRESETS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={searchPriority}
                onChange={(e) => setSearchPriority(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 text-[10px] text-zinc-400 font-mono focus:outline-none"
              >
                <option value="">Cualquier Prioridad</option>
                <option value="Crítica">Crítica</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateButton}
            className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-[#C87533] to-[#F7A600] hover:brightness-110 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Crear Nuevo Mando
          </button>
        </div>

        {/* Buttons List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filteredButtons.length === 0 ? (
            <div className="p-8 text-center text-zinc-600 text-xs font-mono">
              Ningún mando coincide con la búsqueda
            </div>
          ) : (
            filteredButtons.map(btn => {
              const isSelected = btn.id === selectedId;
              const priority = btn.datosTecnicos?.prioridad || 'Media';
              const priorityDot = 
                priority === 'Crítica' ? 'bg-red-500' :
                priority === 'Alta' ? 'bg-[#F7A600]' : 'bg-blue-400';

              return (
                <button
                  key={btn.id}
                  onClick={() => setSelectedId(btn.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                    isSelected 
                      ? 'bg-zinc-900 border border-zinc-800 shadow-md' 
                      : 'hover:bg-zinc-900/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Status color indicator bar */}
                    <span 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: btn.color || '#F7A600' }} 
                    />
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-zinc-400">
                          {btn.id}
                        </span>
                        <span className="text-[8px] font-mono text-zinc-500 font-semibold uppercase bg-zinc-950 px-1 rounded">
                          R{btn.fila}-C{btn.columna}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-zinc-200 block truncate uppercase leading-tight font-mono">
                        {btn.nombre}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 pl-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityDot}`} title={`Prioridad ${priority}`} />
                    {!btn.visible && <span className="text-[8px] font-mono text-red-500 font-extrabold uppercase bg-red-950/20 px-1 rounded border border-red-950/50">Oculto</span>}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Main Editing Workspace */}
      <div className="flex-1 flex flex-col bg-[#08080A]">
        {selectedButton ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Form Fields (2/3 Width) */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 scrollbar-thin">
              
              {/* Header Title with action tools */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Mando Seleccionado: {selectedButton.id}
                  </span>
                  <h1 className="text-lg font-black text-white uppercase tracking-tight">
                    Ficha de Parametrización Industrial
                  </h1>
                </div>

                {/* Duplication / Deletion operations */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDuplicateButton}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 border border-zinc-800 cursor-pointer"
                    title="Duplicar este mando"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#C87533]" />
                    Duplicar
                  </button>
                  <button
                    onClick={handleDeleteButton}
                    className="px-3 py-1.5 bg-red-950/30 hover:bg-red-950/60 text-red-400 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 border border-red-900/30 cursor-pointer"
                    title="Eliminar este mando"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Tabs selectors */}
              <div className="flex border-b border-zinc-900 text-xs font-mono font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('design')}
                  className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'design' 
                      ? 'border-[#F7A600] text-white bg-zinc-900/20' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" />
                    Diseño y Posición
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('technical')}
                  className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'technical' 
                      ? 'border-[#F7A600] text-white bg-zinc-900/20' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Especificación Técnica
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('protocol')}
                  className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === 'protocol' 
                      ? 'border-[#F7A600] text-white bg-zinc-900/20' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Protocolo SOP ({selectedButton.protocolo?.length || 0} pasos)
                  </span>
                </button>
              </div>

              {/* Tab 1: Design and Position */}
              {activeTab === 'design' && (
                <div className="space-y-6">
                  
                  {/* Basic Identifiers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">ID Mando (Solo Lectura)</label>
                      <input
                        type="text"
                        value={selectedButton.id}
                        disabled
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-lg text-xs font-mono cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">Nombre del Mando</label>
                      <input
                        type="text"
                        value={selectedButton.nombre}
                        onChange={(e) => handleFieldChange('nombre', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg text-xs font-bold uppercase focus:outline-none focus:border-[#F7A600] font-mono"
                        placeholder="ej. INHABILITACIÓN DE TRACCIÓN"
                      />
                    </div>
                  </div>

                  {/* Grid Position Coordinates */}
                  <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-900 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono border-b border-zinc-900 pb-2">Posición Física en Tablero (5 x 6)</h3>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Fila (Vertical)</label>
                        <select
                          value={selectedButton.fila}
                          onChange={(e) => handleFieldChange('fila', parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F7A600]"
                        >
                          {[1, 2, 3, 4, 5].map(f => (
                            <option key={f} value={f}>Fila {f}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Columna (Horizontal)</label>
                        <select
                          value={selectedButton.columna}
                          onChange={(e) => handleFieldChange('columna', parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F7A600]"
                        >
                          {[1, 2, 3, 4, 5, 6].map(c => (
                            <option key={c} value={c}>Columna {c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Orden Jerárquico</label>
                        <input
                          type="number"
                          value={selectedButton.orden || 1}
                          onChange={(e) => handleFieldChange('orden', parseInt(e.target.value, 10) || 1)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F7A600]"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Color Design settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Category Select */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">Categoría de Sistema</label>
                      <select
                        value={selectedButton.categoria}
                        onChange={(e) => handleFieldChange('categoria', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F7A600]"
                      >
                        {CATEGORY_PRESETS.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {/* Allow custom category input below */}
                      <input
                        type="text"
                        value={selectedButton.categoria}
                        onChange={(e) => handleFieldChange('categoria', e.target.value)}
                        placeholder="O defina una personalizada..."
                        className="w-full px-3 py-1.5 bg-zinc-950/40 border border-zinc-900 text-zinc-300 rounded-lg text-[11px] font-mono focus:outline-none mt-1.5"
                      />
                    </div>

                    {/* Color Settings */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">Color de Mando</label>
                      
                      <div className="flex items-center gap-3">
                        {/* Interactive Color Input */}
                        <input
                          type="color"
                          value={selectedButton.color || '#F7A600'}
                          onChange={(e) => handleFieldChange('color', e.target.value)}
                          className="w-10 h-10 rounded-lg border-2 border-zinc-800 bg-transparent cursor-pointer flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedButton.color || '#F7A600'}
                          onChange={(e) => handleFieldChange('color', e.target.value)}
                          className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F7A600]"
                        />
                      </div>

                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {COLOR_PRESETS.map((p) => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => handleFieldChange('color', p.value)}
                            className="w-5 h-5 rounded-full border border-zinc-900 shadow-sm hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                            style={{ backgroundColor: p.value }}
                            title={p.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Icon Configurator */}
                  <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-900 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono border-b border-zinc-900 pb-2">Configuración del Icono</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Tipo de Icono</label>
                        <select
                          value={selectedButton.icono.tipo}
                          onChange={(e) => handleIconChange('tipo', e.target.value as any)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F7A600]"
                        >
                          <option value="lucide">Lucide Icon (Estándar)</option>
                          <option value="emoji">Emoji Visual</option>
                          <option value="svg">Código SVG Personalizado</option>
                          <option value="png">Imágen PNG/JPG (URL)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Valor / Entrada del Icono</label>
                        <input
                          type="text"
                          value={selectedButton.icono.valor}
                          onChange={(e) => handleIconChange('valor', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F7A600]"
                          placeholder={selectedButton.icono.tipo === 'lucide' ? 'ej. Ban' : selectedButton.icono.tipo === 'emoji' ? 'ej. 🌡️' : 'Ingresar valor o código...'}
                        />
                      </div>
                    </div>

                    {/* Presets helpers based on icon type */}
                    {selectedButton.icono.tipo === 'lucide' && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Iconos Recomendados (Haga Clic para elegir):</span>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-zinc-950 border border-zinc-900 rounded-lg scrollbar-thin">
                          {POPULAR_LUCIDE_ICONS.map(ic => (
                            <button
                              key={ic}
                              type="button"
                              onClick={() => handleIconChange('valor', ic)}
                              className={`px-2 py-1 text-[10px] font-mono border rounded flex items-center gap-1 cursor-pointer transition-all ${
                                selectedButton.icono.valor === ic
                                  ? 'bg-[#F7A600]/10 border-[#F7A600] text-white font-bold'
                                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                              }`}
                            >
                              <ButtonIconRenderer tipo="lucide" valor={ic} className="w-3.5 h-3.5" color="#F7A600" />
                              {ic}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedButton.icono.tipo === 'emoji' && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Emojis Industriales:</span>
                        <div className="flex flex-wrap gap-2 p-1">
                          {EMOJI_PRESETS.map(em => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => handleIconChange('valor', em)}
                              className="text-lg p-1 bg-zinc-900 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedButton.icono.tipo === 'svg' && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">Código SVG Completo:</span>
                        <textarea
                          value={selectedButton.icono.valor}
                          onChange={(e) => handleIconChange('valor', e.target.value)}
                          className="w-full h-24 p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-[10px] font-mono text-zinc-400 focus:outline-none"
                          placeholder='<svg viewBox="0 0 24 24" stroke="currentColor"...>...</svg>'
                        />
                      </div>
                    )}
                  </div>

                  {/* Operational Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3.5 bg-zinc-950/40 rounded-xl border border-zinc-900">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Botón Activo</span>
                        <span className="text-[10px] text-zinc-500 block">Si se apaga, no mostrará información.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedButton.activo}
                        onChange={(e) => handleFieldChange('activo', e.target.checked)}
                        className="w-5 h-5 accent-[#F7A600] cursor-pointer rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-zinc-950/40 rounded-xl border border-zinc-900">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Mando Visible</span>
                        <span className="text-[10px] text-zinc-500 block">Si se apaga, desaparece del panel.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedButton.visible}
                        onChange={(e) => handleFieldChange('visible', e.target.checked)}
                        className="w-5 h-5 accent-[#F7A600] cursor-pointer rounded"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 2: Technical Specifications */}
              {activeTab === 'technical' && (
                <div className="space-y-6">
                  
                  {/* Technical Meta (System, Component, Priority) */}
                  <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-900 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono border-b border-zinc-900 pb-2">Metadatos de Ingeniería</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Sistema Operativo</label>
                        <input
                          type="text"
                          value={selectedButton.datosTecnicos?.sistema || ''}
                          onChange={(e) => handleTechChange('sistema', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono focus:outline-none"
                          placeholder="ej. Sistema Hidráulico"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Componente Físico</label>
                        <input
                          type="text"
                          value={selectedButton.datosTecnicos?.componente || ''}
                          onChange={(e) => handleTechChange('componente', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono focus:outline-none"
                          placeholder="ej. Solenoide Proporcional"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase block">Prioridad de Alerta</label>
                        <select
                          value={selectedButton.datosTecnicos?.prioridad || 'Media'}
                          onChange={(e) => handleTechChange('prioridad', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#F7A600]"
                        >
                          <option value="Crítica">🚨 Crítica (Parada de Equipo)</option>
                          <option value="Alta">🟧 Alta (Precaución Severa)</option>
                          <option value="Media">🟨 Media (Operación General)</option>
                          <option value="Baja">🟩 Baja (Informativo / Control)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Texts Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">Descripción Técnica</label>
                      <textarea
                        value={selectedButton.descripcion || ''}
                        onChange={(e) => handleFieldChange('descripcion', e.target.value)}
                        className="w-full h-20 p-3 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#F7A600]"
                        placeholder="Escriba la descripción técnica para capacitar a los operadores..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">¿Qué hace mecánicamente?</label>
                      <textarea
                        value={selectedButton.queHace || ''}
                        onChange={(e) => handleFieldChange('queHace', e.target.value)}
                        className="w-full h-20 p-3 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#F7A600]"
                        placeholder="Detalle de qué válvula, embrague o solenoide activa hidráulicamente..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">¿Cuándo se utiliza operacionalmente?</label>
                      <textarea
                        value={selectedButton.cuandoSeUtiliza || ''}
                        onChange={(e) => handleFieldChange('cuandoSeUtiliza', e.target.value)}
                        className="w-full h-20 p-3 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#F7A600]"
                        placeholder="Defina las normas de seguridad u operaciones obligatorias..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-500 block">Advertencia Crítica de Seguridad (Hazard Message)</label>
                      <textarea
                        value={selectedButton.advertencia || ''}
                        onChange={(e) => handleFieldChange('advertencia', e.target.value)}
                        className="w-full h-20 p-3 bg-[#1C1212] border border-red-950 text-red-200 rounded-lg text-xs focus:outline-none focus:border-red-500"
                        placeholder="Ingresar advertencias severas sobre LOTO, pendientes, presiones..."
                      />
                    </div>
                  </div>

                  {/* Image Selector & Base64 Compressor */}
                  <div className="p-4 bg-zinc-950/40 rounded-xl border border-zinc-900 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono border-b border-zinc-900 pb-2">Imagen Ilustrativa del Dispositivo</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Image Input and library */}
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-zinc-500 uppercase">Enlace URL Directo</label>
                          <input
                            type="text"
                            value={selectedButton.imagen || ''}
                            onChange={(e) => handleFieldChange('imagen', e.target.value)}
                            className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg text-[11px] font-mono focus:outline-none"
                            placeholder="https://ejemplo.com/imagen.png"
                          />
                        </div>

                        {/* File selector for local system uploads */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase block">Carga de Imagen Local (Auto-Compresión en Base64)</span>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold border border-zinc-800 cursor-pointer"
                          >
                            <Upload className="w-4 h-4 text-[#F7A600]" />
                            Cargar Imagen de PC
                          </button>
                        </div>
                      </div>

                      {/* Image Preview Box with discard action */}
                      <div className="relative aspect-video bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex items-center justify-center">
                        {selectedButton.imagen ? (
                          <>
                            <img
                              src={selectedButton.imagen}
                              alt="Button graphic"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-black border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                              title="Eliminar imágen"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block">Ninguna imagen asociada</span>
                            <span className="text-[8px] font-mono text-zinc-700 block mt-1">Sube un archivo o pega una URL para ilustrar el componente.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 3: Operation Protocol Steps */}
              {activeTab === 'protocol' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">Secuencia de Pasos para Activación Segura</h3>
                    <button
                      onClick={handleAddProtocolStep}
                      className="px-2.5 py-1 bg-[#F7A600]/10 hover:bg-[#F7A600]/25 text-[#F7A600] border border-[#F7A600]/30 rounded text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agregar Paso
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(!selectedButton.protocolo || selectedButton.protocolo.length === 0) ? (
                      <div className="p-8 text-center bg-zinc-950/20 border border-zinc-900 rounded-xl text-zinc-600 font-mono text-xs">
                        Este mando no requiere protocolo secuencial de pasos.
                      </div>
                    ) : (
                      selectedButton.protocolo.map((step, sIdx) => (
                        <div key={sIdx} className="flex gap-2 items-center bg-zinc-950/40 p-3 rounded-xl border border-zinc-900/60 group">
                          
                          {/* Circle Index */}
                          <div className="w-6 h-6 flex-shrink-0 rounded-full bg-zinc-900 border border-zinc-800 text-[#F7A600] text-xs font-mono font-bold flex items-center justify-center">
                            {sIdx + 1}
                          </div>

                          {/* Editable Step Text Input */}
                          <input
                            type="text"
                            value={step}
                            onChange={(e) => handleEditProtocolStep(sIdx, e.target.value)}
                            className="flex-1 bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-[#F7A600] text-xs text-zinc-200 py-1 px-1 focus:outline-none font-mono"
                          />

                          {/* Move / Sort / Delete Operations */}
                          <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveProtocolStep(sIdx, 'up')}
                              disabled={sIdx === 0}
                              className={`p-1 hover:bg-zinc-800 rounded border border-zinc-900 text-zinc-400 ${sIdx === 0 ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveProtocolStep(sIdx, 'down')}
                              disabled={sIdx === (selectedButton.protocolo || []).length - 1}
                              className={`p-1 hover:bg-zinc-800 rounded border border-zinc-900 text-zinc-400 ${sIdx === (selectedButton.protocolo || []).length - 1 ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProtocolStep(sIdx)}
                              className="p-1 hover:bg-red-950/40 hover:text-red-400 rounded border border-zinc-900 text-zinc-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* 3. Real-time Visual Preview (1/3 Width) */}
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-zinc-900 bg-[#0F0F12] p-6 flex flex-col justify-between overflow-y-auto scrollbar-thin">
              <div className="space-y-6">
                
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                  <Eye className="w-4 h-4 text-[#F7A600]" />
                  PREVISUALIZACIÓN REAL
                </span>

                {/* Simulated Physical Cabinet Button */}
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">En Tablero Principal:</span>
                  <div className="bg-[#050507] p-4 rounded-xl border border-zinc-900 flex justify-center shadow-inner">
                    <div className="w-36 h-36 relative flex flex-col items-center justify-between p-4 bg-[#151518] border-2 border-zinc-800 rounded-xl">
                      {/* Grid Position */}
                      <span className="absolute top-1.5 right-2 text-[9px] font-bold font-mono text-zinc-600">
                        {selectedButton.fila}-{selectedButton.columna}
                      </span>
                      {/* Accent color top bar */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl" 
                        style={{ backgroundColor: selectedButton.color || '#F7A600' }}
                      />
                      
                      {/* LED Dot */}
                      <div className="absolute top-1.5 left-2.5 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedButton.activo ? 'bg-[#4CAF50] shadow-[0_0_4px_#4CAF50]' : 'bg-zinc-800'}`} />
                      </div>

                      {/* Icon */}
                      <div className="mt-3 flex-grow flex items-center justify-center">
                        <ButtonIconRenderer
                          tipo={selectedButton.icono.tipo}
                          valor={selectedButton.icono.valor}
                          className="w-7 h-7"
                          color={selectedButton.color || '#F7A600'}
                        />
                      </div>

                      {/* Label */}
                      <span className="text-[9px] font-bold uppercase tracking-tight leading-none text-center text-zinc-300 w-full truncate">
                        {selectedButton.nombre}
                      </span>

                      {/* Tiny status label */}
                      <span className="text-[7px] font-mono text-zinc-600 leading-none">MANDO ACTIVO</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Tooltip Card Preview */}
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase font-semibold">Ficha de Información:</span>
                  <div className="bg-[#121215] border border-zinc-800 rounded-xl p-4 text-left space-y-3 shadow-md font-sans">
                    <div className="flex justify-between items-start gap-2 border-b border-zinc-900 pb-2">
                      <div className="min-w-0">
                        <span className="text-[8px] font-mono text-zinc-500 block">ID: {selectedButton.id}</span>
                        <h4 className="text-[11px] font-black text-white truncate uppercase font-mono">{selectedButton.nombre}</h4>
                      </div>
                      <span className="text-[7px] bg-orange-950/40 border border-[#F7A600]/30 text-[#F7A600] px-1.5 py-0.5 rounded font-bold font-mono uppercase">
                        {selectedButton.datosTecnicos?.prioridad || 'Media'}
                      </span>
                    </div>
                    
                    {/* Tiny specs */}
                    <div className="space-y-2 text-[10px]">
                      <p className="text-zinc-400 line-clamp-3 leading-snug">{selectedButton.descripcion}</p>
                      
                      {selectedButton.advertencia && (
                        <div className="bg-red-950/20 border-l-2 border-red-500 p-2 text-[9px] text-red-300 leading-tight">
                          ⚠️ {selectedButton.advertencia}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Back to main controls button */}
              <div className="pt-6 mt-6 border-t border-zinc-900">
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F7A600]" />
                  Terminar Edición
                </button>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-500 font-mono text-sm">
            Ningún mando disponible. Haga clic en "Crear Nuevo Mando" para empezar.
          </div>
        )}
      </div>

    </div>
  );
}
