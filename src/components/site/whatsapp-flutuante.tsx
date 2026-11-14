import { linkWhatsApp } from "@/lib/config/site";
import { IconeWhatsApp } from "./icones";

export function WhatsAppFlutuante() {
  return (
    <a
      href={linkWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      className="fixed right-4 bottom-4 z-50 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/30 transition hover:scale-105"
    >
      <IconeWhatsApp className="size-7" />
    </a>
  );
}
