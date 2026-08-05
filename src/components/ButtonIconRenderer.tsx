import React from 'react';
import * as Icons from 'lucide-react';

export type IconType = 'lucide' | 'emoji' | 'svg' | 'png' | 'url';

interface ButtonIconRendererProps {
  tipo: IconType;
  valor: string;
  className?: string;
  color?: string;
}

export default function ButtonIconRenderer({
  tipo,
  valor,
  className = "w-6 h-6",
  color
}: ButtonIconRendererProps) {
  
  // Custom Inline SVG Sanitizer / Renderer
  if (tipo === 'svg') {
    try {
      // Basic validation of SVG string
      if (valor && valor.includes('<svg')) {
        return (
          <div 
            className={`${className} flex items-center justify-center`}
            style={{ color: color || 'currentColor' }}
            dangerouslySetInnerHTML={{ __html: valor }}
          />
        );
      }
    } catch (e) {
      console.error('Invalid SVG content:', e);
    }
    // Fallback if SVG fails
    return <Icons.Settings className={className} style={{ color }} />;
  }

  // Emojis
  if (tipo === 'emoji') {
    return (
      <span className="text-xl sm:text-2xl select-none leading-none block font-normal">
        {valor || '⚙️'}
      </span>
    );
  }

  // PNG, Base64, or remote URLs
  if (tipo === 'png' || tipo === 'url') {
    return (
      <img
        src={valor || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=80&auto=format&fit=crop&q=60'}
        alt="Button Icon"
        className={`${className} object-contain`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback image on error
          (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 15L16 10L5 21"/></svg>';
        }}
      />
    );
  }

  // Lucide Icons
  const IconComponent = (Icons as any)[valor];
  if (IconComponent) {
    return <IconComponent className={className} style={{ color }} />;
  }

  // Default fallback Lucide icon
  return <Icons.Sliders className={className} style={{ color }} />;
}

// Available Lucide Icons list for selection
export const POPULAR_LUCIDE_ICONS = [
  'Ban', 'Droplets', 'Disc', 'Lock', 'Settings', 'Shuffle',
  'Compass', 'XCircle', 'Activity', 'Sun', 'TriangleAlert', 'Sliders',
  'ArrowUpDown', 'Power', 'ArrowUp', 'Hash', 'Thermometer', 'Hourglass',
  'Unlock', 'Waves', 'Link', 'OctagonAlert', 'Turtle', 'Gauge', 'Filter',
  'Truck', 'RefreshCw', 'Key', 'Fan', 'Battery', 'Lightbulb', 'Bell',
  'Radio', 'Eye', 'Wrench', 'Cpu', 'Database', 'ShieldAlert', 'Flame',
  'Zap', 'Wind', 'Volume2', 'Wrench', 'HardHat', 'Trash2', 'Copy'
];
