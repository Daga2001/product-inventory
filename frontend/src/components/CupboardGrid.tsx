import { Zone } from '../api/types';

interface CupboardGridProps {
  zones: Zone[];
  selectedZoneId?: string;
  onSelect: (zone: Zone) => void;
  isLoading?: boolean;
  error?: string | null;
  placeholderZones?: Zone[];
  onRenameZone?: (zoneId: string, name: string) => void;
}

const CupboardGrid = ({
  zones,
  selectedZoneId,
  onSelect,
  isLoading = false,
  error,
  placeholderZones,
  onRenameZone
}: CupboardGridProps) => {
  const hasRealZones = zones.length > 0;
  const isPlaceholderMode = !hasRealZones && (placeholderZones?.length ?? 0) > 0;
  const displayZones = hasRealZones ? zones : placeholderZones ?? [];
  const topZones = displayZones.filter((zone) => zone.position_y === 1);
  const lowerZones = displayZones.filter((zone) => zone.position_y > 1);
  const lowerMaxX = Math.max(...lowerZones.map((zone) => zone.position_x), 5);
  const lowerMaxY = Math.max(...lowerZones.map((zone) => zone.position_y), 2);
  const lowerRowCount = lowerZones.length ? lowerMaxY - 1 : 0;
  const topRowHeight = 180;
  const rowHeight = lowerMaxY > 4 ? 96 : 110;
  const hasZones = displayZones.length > 0;
  const zoneCount = hasRealZones ? zones.length : placeholderZones?.length ?? 0;

  return (
    <section className="cupboard-card">
      <div className="cupboard-header">
        <div>
          <h2 className="font-display text-xl text-white">Cupboard Layout</h2>
          <p className="text-sm text-white/70">Click a zone to view assigned products.</p>
        </div>
        <span className="text-xs text-white/70">
          {isLoading ? '—' : isPlaceholderMode ? `${zoneCount} template zones` : `${zoneCount} zones`}
        </span>
      </div>

      <div className="cupboard-shell">
        <div className="cupboard-frame">
          {isLoading ? (
            <div className="cupboard-empty">Loading zones...</div>
          ) : error ? (
            <div className="cupboard-empty">Unable to load zones. Please try again later.</div>
          ) : hasZones ? (
            <>
              {topZones.length > 0 ? (
                <div className="cupboard-top">
                  <div
                    className="top-zone-grid gap-3 sm:gap-5"
                    style={{
                      gridAutoRows: `${topRowHeight}px`
                    }}
                  >
                    {topZones.map((zone) => {
                      const isActive = zone.id === selectedZoneId;
                      const isReadOnly = isPlaceholderMode || !onRenameZone;
                      const isClickable = !isPlaceholderMode;
                      return (
                        <div
                          key={zone.id}
                          role={isClickable ? 'button' : undefined}
                          tabIndex={isClickable ? 0 : -1}
                          aria-pressed={isClickable ? isActive : undefined}
                          onClick={isClickable ? () => onSelect(zone) : undefined}
                          onKeyDown={
                            isClickable
                              ? (event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    onSelect(zone);
                                  }
                                }
                              : undefined
                          }
                          className={`cupboard-cell ${isActive ? 'is-active' : ''} ${
                            isReadOnly ? 'is-disabled' : 'is-clickable'
                          }`}
                        >
                          <span className="cupboard-knob" aria-hidden="true" />
                          <input
                            key={`${zone.id}-${zone.name}`}
                            className="zone-name-input"
                            defaultValue={zone.name}
                            readOnly={isReadOnly}
                            aria-label="Zone name"
                            onClick={(event) => event.stopPropagation()}
                            onFocus={(event) => event.stopPropagation()}
                            onKeyDown={(event) => {
                              event.stopPropagation();
                              if (event.key === 'Enter') {
                                event.preventDefault();
                                event.currentTarget.blur();
                              }
                            }}
                            onBlur={(event) => {
                              if (isReadOnly) return;
                              const nextValue = event.currentTarget.value.trim();
                              if (!nextValue) {
                                event.currentTarget.value = zone.name;
                                return;
                              }
                              onRenameZone?.(zone.id, nextValue);
                            }}
                          />
                          <span className="cupboard-handle" aria-hidden="true" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {lowerZones.length > 0 ? (
                <>
                  <div className="cupboard-divider" />
                  <div className="cupboard-lower">
                    <div
                      className={`cupboard-grid min-w-[640px] sm:min-w-0 ${topZones.length ? 'mt-2' : ''}`}
                      style={{
                        gridTemplateColumns: `repeat(${lowerMaxX}, minmax(130px, 1fr))`,
                        gridTemplateRows: `repeat(${lowerRowCount}, ${rowHeight}px)`
                      }}
                    >
                      {lowerZones.map((zone) => {
                        const isActive = zone.id === selectedZoneId;
                        const isReadOnly = isPlaceholderMode || !onRenameZone;
                        const isClickable = !isPlaceholderMode;
                        return (
                          <div
                            key={zone.id}
                            role={isClickable ? 'button' : undefined}
                            tabIndex={isClickable ? 0 : -1}
                            aria-pressed={isClickable ? isActive : undefined}
                            onClick={isClickable ? () => onSelect(zone) : undefined}
                            onKeyDown={
                              isClickable
                                ? (event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                      event.preventDefault();
                                      onSelect(zone);
                                    }
                                  }
                                : undefined
                            }
                            className={`cupboard-cell ${isActive ? 'is-active' : ''} ${
                              isReadOnly ? 'is-disabled' : 'is-clickable'
                            }`}
                            style={{
                              gridColumn: `${zone.position_x}`,
                              gridRow: `${zone.position_y - 1}`
                            }}
                          >
                            <span className="cupboard-knob" aria-hidden="true" />
                            <input
                              key={`${zone.id}-${zone.name}`}
                              className="zone-name-input"
                              defaultValue={zone.name}
                              readOnly={isReadOnly}
                              aria-label="Zone name"
                              onClick={(event) => event.stopPropagation()}
                              onFocus={(event) => event.stopPropagation()}
                            onKeyDown={(event) => {
                              event.stopPropagation();
                              if (event.key === 'Enter') {
                                event.preventDefault();
                                event.currentTarget.blur();
                              }
                            }}
                              onBlur={(event) => {
                                if (isReadOnly) return;
                                const nextValue = event.currentTarget.value.trim();
                                if (!nextValue) {
                                  event.currentTarget.value = zone.name;
                                  return;
                                }
                                onRenameZone?.(zone.id, nextValue);
                              }}
                            />
                            <span className="cupboard-handle" aria-hidden="true" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <div className="cupboard-empty">No zones available.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CupboardGrid;
