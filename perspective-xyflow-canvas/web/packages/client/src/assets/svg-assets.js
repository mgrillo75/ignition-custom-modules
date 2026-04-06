import gensetPanelSvg from "./vendor/genset-panel.svg";
import gensetPanelTransparentSvg from "./vendor/genset-panel-transparent.svg";
import gensetPanelR2Svg from "./vendor/genset-panel_r2.svg";
import gensetPanelR2TransparentSvg from "./vendor/genset-panel_r2-transparent.svg";
import modernLineSvg from "./vendor/modern-line.svg";
import modernLineRev2Svg from "./vendor/modern-line-rev2.svg";
import modernTankSvg from "./vendor/modern-tank.svg";
import modernTankRev2Svg from "./vendor/modern-tank-rev2.svg";
import modernValveControlSvg from "./vendor/modern-valve-control.svg";
import modernValveControlRev2Svg from "./vendor/modern-valve-control-rev2.svg";

const breakerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 162" width="162" height="162" role="img" aria-label="Breaker">
  <defs>
    <filter id="breaker-glow" x="-160%" y="-160%" width="420%" height="420%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#34d399" flood-opacity="0.65"/>
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#34d399" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect x="1" y="1" width="160" height="160" rx="18" fill="#0f172a" stroke="#1e293b" />
  <g filter="url(#breaker-glow)" stroke="#34d399" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <line x1="81" y1="18" x2="81" y2="42" />
    <line x1="81" y1="120" x2="81" y2="144" />
    <path d="M81 42 L81 60" />
    <circle cx="81" cy="76" r="16" />
    <path d="M81 60 L81 92" />
    <path d="M57 108 L105 108" />
  </g>
  <text x="81" y="94" fill="#e2e8f0" font-size="18" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI, Arial, sans-serif">52I</text>
</svg>
`.trim();

export const SVG_ASSETS = {
    breaker: breakerSvg,
    "genset-panel": gensetPanelSvg,
    "genset-panel-transparent": gensetPanelTransparentSvg,
    "genset-panel-r2": gensetPanelR2Svg,
    "genset-panel-r2-transparent": gensetPanelR2TransparentSvg,
    "modern-line": modernLineSvg,
    "modern-line-rev2": modernLineRev2Svg,
    "modern-tank": modernTankSvg,
    "modern-tank-rev2": modernTankRev2Svg,
    "modern-valve-control": modernValveControlSvg,
    "modern-valve-control-rev2": modernValveControlRev2Svg
};
