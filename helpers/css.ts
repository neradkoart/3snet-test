/** Converts hex color (e.g. "#219653" or " #219653") to rgb string for comparison with computed style */
export function hexToRgb(hex: string): string {
    const cleaned = hex.trim().replace(/^#/, '');
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
}