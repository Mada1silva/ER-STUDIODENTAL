import qrcode from "qrcode-generator";

/** QR code em SVG, gerado no servidor (não depende de serviço externo). */
export function QrCode({ texto, className }: { texto: string; className?: string }) {
  const q = qrcode(0, "M");
  q.addData(texto);
  q.make();
  const n = q.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} className={className} shapeRendering="crispEdges" role="img" aria-label="QR code do acompanhamento">
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#fff" />
      <path d={d} fill="#1c2023" />
    </svg>
  );
}
