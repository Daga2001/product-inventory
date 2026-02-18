import { Zone } from '../api/types';

interface CupboardGridProps {
  zones: Zone[];
  selectedZoneId?: string;
  onSelect: (zone: Zone) => void;
}

const layoutOverrides: Record<string, { rowSpan: number; colSpan: number }> = {
  'Top A': { rowSpan: 2, colSpan: 1 },
  'Top B': { rowSpan: 2, colSpan: 1 },
  'Top C': { rowSpan: 2, colSpan: 1 },
  'Top D': { rowSpan: 2, colSpan: 1 }
};

const CupboardGrid = ({ zones, selectedZoneId, onSelect }: CupboardGridProps) => {
  const maxX = Math.max(...zones.map((zone) => zone.position_x), 4);
  const maxY = Math.max(...zones.map((zone) => zone.position_y), 4);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl">Cupboard Layout</h2>
          <p className="text-sm text-slate">Click a zone to view assigned products.</p>
        </div>
        <span className="text-xs text-slate">{zones.length} zones</span>
      </div>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${maxX}, minmax(110px, 1fr))`,
          gridAutoRows: '90px'
        }}
      >
        {zones.map((zone) => {
          const override = layoutOverrides[zone.name] ?? { rowSpan: 1, colSpan: 1 };
          const isActive = zone.id === selectedZoneId;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onSelect(zone)}
              className={`grid-cell text-left p-4 ${
                isActive ? 'border-accent shadow-card bg-accentSoft/40' : ''
              }`}
              style={{
                gridColumn: `${zone.position_x} / span ${override.colSpan}`,
                gridRow: `${zone.position_y} / span ${override.rowSpan}`
              }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate">Zone</p>
              <p className="mt-2 font-semibold text-ink">{zone.name}</p>
              <p className="mt-3 text-xs text-slate">X{zone.position_x} · Y{zone.position_y}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CupboardGrid;
