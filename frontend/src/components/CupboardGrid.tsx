import { Zone } from '../api/types';

interface CupboardGridProps {
  zones: Zone[];
  selectedZoneId?: string;
  onSelect: (zone: Zone) => void;
  isLoading?: boolean;
  error?: string | null;
}

const CupboardGrid = ({ zones, selectedZoneId, onSelect, isLoading = false, error }: CupboardGridProps) => {
  const topZones = zones.filter((zone) => zone.position_y === 1);
  const lowerZones = zones.filter((zone) => zone.position_y > 1);
  const lowerMaxX = Math.max(...lowerZones.map((zone) => zone.position_x), 5);
  const lowerMaxY = Math.max(...lowerZones.map((zone) => zone.position_y), 2);
  const lowerRowCount = lowerZones.length ? lowerMaxY - 1 : 0;
  const topRowHeight = 180;
  const rowHeight = lowerMaxY > 4 ? 96 : 110;
  const hasZones = zones.length > 0;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl">Cupboard Layout</h2>
          <p className="text-sm text-slate">Click a zone to view assigned products.</p>
        </div>
        <span className="text-xs text-slate">{isLoading ? '—' : `${zones.length} zones`}</span>
      </div>
      <div className="rounded-3xl border border-slate/15 bg-white/70 p-4 sm:p-6 overflow-x-auto">
        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-slate/30 p-6 text-center text-slate">
            Loading zones...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-warning/40 p-6 text-center text-warning">
            Unable to load zones. Please try again later.
          </div>
        ) : hasZones ? (
          <>
            {topZones.length > 0 ? (
              <div
                className="grid gap-4 sm:gap-5 w-fit max-w-full mx-auto min-w-[520px] sm:min-w-0"
                style={{
                  gridTemplateColumns: `repeat(${topZones.length}, minmax(130px, 170px))`,
                  gridAutoRows: `${topRowHeight}px`
                }}
              >
                {topZones.map((zone) => {
                  const isActive = zone.id === selectedZoneId;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => onSelect(zone)}
                      className={`grid-cell text-left p-4 ${
                        isActive ? 'border-accent shadow-card bg-accentSoft/50' : ''
                      }`}
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
            ) : null}

            {lowerZones.length > 0 ? (
              <div
                className={`grid gap-4 sm:gap-5 min-w-[640px] sm:min-w-0 ${topZones.length ? 'mt-6' : ''}`}
                style={{
                  gridTemplateColumns: `repeat(${lowerMaxX}, minmax(130px, 1fr))`,
                  gridTemplateRows: `repeat(${lowerRowCount}, ${rowHeight}px)`
                }}
              >
                {lowerZones.map((zone) => {
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
                        gridRow: `${zone.position_y - 1}`
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
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate/30 p-6 text-center text-slate">
            No zones available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CupboardGrid;
