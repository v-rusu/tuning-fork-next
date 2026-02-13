import type { ChordPosition } from '@/lib/data/chords';

interface ChordDiagramProps {
  name: string;
  position: ChordPosition;
  stringCount?: number;
  fretCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ChordDiagram({
  name,
  position,
  stringCount = 6,
  fretCount = 4,
  size = 'md',
}: ChordDiagramProps) {
  const { frets, fingers, baseFret, barres } = position;

  // Size configurations
  const sizes = {
    sm: { width: 100, height: 120, stringSpacing: 14, fretSpacing: 20, dotRadius: 5 },
    md: { width: 150, height: 180, stringSpacing: 22, fretSpacing: 30, dotRadius: 8 },
    lg: { width: 200, height: 240, stringSpacing: 30, fretSpacing: 40, dotRadius: 10 },
  };

  const config = sizes[size];
  const padding = { top: 30, left: 20, right: 20, bottom: 20 };

  const diagramWidth = config.stringSpacing * (stringCount - 1);
  const diagramHeight = config.fretSpacing * fretCount;

  const svgWidth = diagramWidth + padding.left + padding.right;
  const svgHeight = diagramHeight + padding.top + padding.bottom;

  // Get x position for a string (0 = leftmost)
  const getStringX = (stringIndex: number) =>
    padding.left + stringIndex * config.stringSpacing;

  // Get y position for a fret (0 = nut)
  const getFretY = (fretIndex: number) =>
    padding.top + fretIndex * config.fretSpacing;

  // Determine if we need to show base fret indicator
  const showBaseFret = baseFret > 1;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="chord-diagram"
      aria-label={`${name} chord diagram`}
    >
      {/* Chord name */}
      <text
        x={svgWidth / 2}
        y={12}
        textAnchor="middle"
        className="fill-white text-sm font-bold"
        fontSize={size === 'lg' ? 16 : size === 'md' ? 14 : 12}
      >
        {name}
      </text>

      {/* Nut (if base fret is 1) */}
      {!showBaseFret && (
        <rect
          x={padding.left - 2}
          y={padding.top - 4}
          width={diagramWidth + 4}
          height={4}
          className="fill-white"
        />
      )}

      {/* Base fret indicator */}
      {showBaseFret && (
        <text
          x={padding.left - 10}
          y={getFretY(0.5) + 4}
          textAnchor="end"
          className="fill-text-secondary text-xs"
          fontSize={size === 'lg' ? 12 : 10}
        >
          {baseFret}
        </text>
      )}

      {/* Frets (horizontal lines) */}
      {Array.from({ length: fretCount + 1 }).map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={padding.left}
          y1={getFretY(i)}
          x2={padding.left + diagramWidth}
          y2={getFretY(i)}
          stroke="var(--fret-color, #64748b)"
          strokeWidth={i === 0 && !showBaseFret ? 0 : 1}
        />
      ))}

      {/* Strings (vertical lines) */}
      {Array.from({ length: stringCount }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={getStringX(i)}
          y1={padding.top}
          x2={getStringX(i)}
          y2={padding.top + diagramHeight}
          stroke="var(--string-color, #94a3b8)"
          strokeWidth={1}
        />
      ))}

      {/* Barres */}
      {barres?.map(([fret, startString, endString], i) => (
        <rect
          key={`barre-${i}`}
          x={getStringX(startString) - config.dotRadius}
          y={getFretY(fret - baseFret + 1) - config.fretSpacing / 2 - config.dotRadius}
          width={getStringX(endString) - getStringX(startString) + config.dotRadius * 2}
          height={config.dotRadius * 2}
          rx={config.dotRadius}
          className="fill-[var(--finger-color,#22c55e)]"
        />
      ))}

      {/* Finger positions */}
      {frets.map((fret, stringIndex) => {
        const x = getStringX(stringIndex);

        if (fret === -1) {
          // Muted string (X)
          const y = padding.top - 12;
          return (
            <text
              key={`muted-${stringIndex}`}
              x={x}
              y={y}
              textAnchor="middle"
              className="fill-[var(--muted-color,#ef4444)]"
              fontSize={size === 'lg' ? 14 : 12}
            >
              x
            </text>
          );
        }

        if (fret === 0) {
          // Open string (O)
          const y = padding.top - 12;
          return (
            <circle
              key={`open-${stringIndex}`}
              cx={x}
              cy={y}
              r={config.dotRadius - 2}
              fill="none"
              stroke="var(--open-color, #94a3b8)"
              strokeWidth={2}
            />
          );
        }

        // Fretted note
        const y = getFretY(fret - baseFret + 1) - config.fretSpacing / 2;
        const finger = fingers[stringIndex];

        return (
          <g key={`fret-${stringIndex}`}>
            <circle
              cx={x}
              cy={y}
              r={config.dotRadius}
              className="fill-[var(--finger-color,#22c55e)]"
            />
            {finger > 0 && size !== 'sm' && (
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                className="fill-white font-bold"
                fontSize={size === 'lg' ? 12 : 10}
              >
                {finger}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
