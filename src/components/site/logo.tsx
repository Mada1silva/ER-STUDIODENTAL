import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/config/site";

export function Logo({ href = "/", subtitulo = "Studio Dental" }: { href?: string; subtitulo?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <Image src="/img/monograma-er.png" alt="" width={44} height={44} className="rounded-md" priority />
      <span className="leading-tight">
        <span className="block font-serif text-xl font-semibold tracking-[0.12em] text-prata-100">EDMAR REIS</span>
        <span className="block text-[10px] uppercase tracking-[0.35em] text-prata-400">{subtitulo}</span>
      </span>
      <span className="sr-only">{site.nome}</span>
    </Link>
  );
}
