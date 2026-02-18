import { Zone } from '../api/types';

interface CupboardGridProps {
  zones: Zone[];
  selectedZoneId?: string;
  onSelect: (zone: Zone) => void;
}

const CupboardGrid = ({ zones, selectedZoneId, onSelect }: CupboardGridProps) => {
  const maxX = Math.max(...zones.map((zone) => zone.position_x), 4);
  const maxY = Math.max(...zones.map((zone) => zone.position_y), 4);
  const topRowHeight = 180;
  const rowHeight = 110;
  const rowTemplate = maxY > 1 ? `${topRowHeight}px repeat(${maxY - 1}, ${rowHeight}px)` : `${topRowHeight}px`;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl">Cupboard Layout</h2>
          <p className="text-sm text-slate">Click a zone to view assigned products.</p>
        </div>
        <span className="text-xs text-slate">{zones.length} zones</span>
      </div>
      <div className="rounded-3xl border border-slate/15 bg-white/70 p-4 sm:p-6 overflow-x-auto">
        <div
          className="grid gap-4 sm:gap-5 min-w-[640px] sm:min-w-0"
          style={{
            gridTemplateColumns: `repeat(${maxX}, minmax(130px, 1fr))`,
            gridTemplateRows: rowTemplate
          }}
        >
          {zones.map((zone) => {
            const isActive = zone.id === selectedZoneId;
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => onSelect(zone)}
                className={`grid-cell text-left p-4 ${
                  isActive ? 'border-accent shadow-card bg-accentSoft/50' : ''
                }`}
                style={{
                  gridColumn: `${zone.position_x}`,
                  gridRow: `${zone.position_y}`
                }}
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate">Zone</p>
                  <p className="mt-2 font-semibold text-ink">{zone.name}</p>
                </div>
                <p className="text-xs text-slate">X{zone.position_x} · Y{zone.position_y}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CupboardGrid;
