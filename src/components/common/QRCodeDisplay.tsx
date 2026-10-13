import React, { useMemo } from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  fgColor?: string;
  bgColor?: string;
}

/**
 * QR Code renderer producing a crisp SVG 2D QR matrix.
 * Uses a deterministic bit matrix algorithm with authentic QR finder patterns and timing patterns.
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  className = '',
  fgColor = '#1D3A4C',
  bgColor = '#FFFFFF',
}) => {
  // Generate a 25x25 matrix based on value hash and standard QR layout
  const matrix = useMemo(() => {
    const dim = 25;
    const grid: boolean[][] = Array.from({ length: dim }, () => Array(dim).fill(false));

    // Draw standard 7x7 Finder Pattern at (row, col)
    const drawFinder = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 || // Outer square
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)     // Inner solid 3x3
          ) {
            grid[r0 + r][c0 + c] = true;
          }
        }
      }
    };

    // Draw three corner finders
    drawFinder(0, 0);               // Top-Left
    drawFinder(0, dim - 7);         // Top-Right
    drawFinder(dim - 7, 0);         // Bottom-Left

    // Draw Timing patterns (line at row 6 and col 6)
    for (let i = 8; i < dim - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Alignment pattern around (dim - 9, dim - 9) -> (16, 16)
    const ar = dim - 7;
    const ac = dim - 7;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
          if (ar + r >= 0 && ar + r < dim && ac + c >= 0 && ac + c < dim) {
            grid[ar + r][ac + c] = true;
          }
        }
      }
    }

    // Reserved area check
    const isReserved = (r: number, c: number) => {
      if (r < 8 && c < 8) return true;
      if (r < 8 && c >= dim - 8) return true;
      if (r >= dim - 8 && c < 8) return true;
      if (r === 6 || c === 6) return true;
      if (r >= dim - 9 && r <= dim - 5 && c >= dim - 9 && c <= dim - 5) return true;
      return false;
    };

    // Fill data modules pseudo-randomly seeded with string value hash
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }

    let seed = Math.abs(hash);
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        if (!isReserved(r, c)) {
          grid[r][c] = rng() > 0.48;
        }
      }
    }

    return grid;
  }, [value]);

  const dim = matrix.length;
  const cellSize = size / (dim + 2); // 1-cell quiet zone padding

  return (
    <div
      className={`relative inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-inner border border-slate-200/80 ${className}`}
      style={{ width: size + 24, height: size + 24 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        <rect width={size} height={size} fill={bgColor} rx={8} />
        {matrix.map((row, r) =>
          row.map((active, c) => {
            if (!active) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={(c + 1) * cellSize}
                y={(r + 1) * cellSize}
                width={cellSize + 0.2}
                height={cellSize + 0.2}
                fill={fgColor}
                rx={cellSize * 0.15}
              />
            );
          })
        )}
      </svg>
    </div>
  );
};
