import { Logo } from "@/components/site/logo";
import { linkWhatsApp } from "@/lib/config/site";

export const metadata = { title: "Portal do Dentista" };

export default function Portal() {
  return (
    <div className="grid min-h-dvh place-items-center bg-grafite-800 px-4 text-prata-300">
      <div className="max-w-md space-y-6 text-center">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="font-serif text-4xl text-prata-100">Portal do Dentista</h1>
        <p>
          Em breve você poderá enviar pedidos e acompanhar cada etapa dos seus trabalhos por aqui. Enquanto isso, fale
          com a gente pelo WhatsApp.
        </p>
        <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-whatsapp px-6 py-3 font-medium text-white">
          Chamar no WhatsApp
        </a>
      </div>
    </div>
  );
}
