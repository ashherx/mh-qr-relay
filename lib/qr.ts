import QRCode from "qrcode";

const options = {
  errorCorrectionLevel: "M",
  margin: 4,
  color: { dark: "#000000", light: "#ffffff" },
} as const;

export function qrPng(text: string, width = 1024): Promise<Buffer> {
  return QRCode.toBuffer(text, { ...options, type: "png", width });
}

export function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, { ...options, type: "svg" });
}

export function qrDataUrl(text: string, width = 480): Promise<string> {
  return QRCode.toDataURL(text, { ...options, type: "image/png", width });
}
