import Link from "next/link";
import { GraduationCap, Phone, Mail, MapPin, Send } from "lucide-react";
import { translate } from "@/lib/dictionary";

type SettingsLite = {
  siteName?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  telegram?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  youtube?: string | null;
} | null;

const sectionLinks = [
  { href: "/maktab-haqida", key: "nav.about" },
  { href: "/yangiliklar", key: "nav.news" },
  { href: "/oqituvchilar", key: "nav.teachers" },
  { href: "/tadbirlar", key: "nav.events" },
  { href: "/galereya", key: "nav.gallery" },
  { href: "/hujjatlar", key: "nav.documents" },
  { href: "/dars-jadvali", key: "nav.schedule" },
];

export default function Footer({ dict, settings }: { dict: Record<string, string>; settings: SettingsLite }) {
  const siteName = settings?.siteName || "Chortoq 6-sonli maktab";
  const contacts = [
    { icon: MapPin, value: settings?.address },
    { icon: Phone, value: settings?.phone },
    { icon: Mail, value: settings?.email },
  ].filter((c) => c.value);

  const socials = [
    { href: settings?.telegram, label: <Send className="w-5 h-5" /> },
    { href: settings?.instagram, label: "IG" },
    { href: settings?.facebook, label: "FB" },
    { href: settings?.youtube, label: "YT" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-[#0a2e2a] text-zinc-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white"><GraduationCap className="w-6 h-6" /></div>
            <div>
              <div className="font-bold text-white text-sm">{siteName}</div>
              <div className="text-xs text-teal-200">{translate(dict, "footer.schoolType")}</div>
            </div>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">{translate(dict, "footer.about")}</p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">{translate(dict, "footer.sections")}</h4>
          <ul className="space-y-2 text-sm">
            {sectionLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white">{translate(dict, l.key)}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">{translate(dict, "footer.contact")}</h4>
          {contacts.length === 0 ? (
            <p className="text-sm text-zinc-500">{translate(dict, "empty.noData")}</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {contacts.map((c, i) => (
                <li key={i} className="flex gap-2"><c.icon className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" /> {c.value}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">{translate(dict, "footer.socials")}</h4>
          {socials.length > 0 && (
            <div className="flex gap-2">
              {socials.map((s, i) => (
                <a key={i} href={s.href!} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-teal-600 transition-colors text-xs">{s.label}</a>
              ))}
            </div>
          )}
          <p className="text-xs text-zinc-500 mt-6">© {new Date().getFullYear()} {siteName}. {translate(dict, "footer.rights")}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-zinc-500 text-center">
          {translate(dict, "footer.madeFor")}
        </div>
      </div>
    </footer>
  );
}
