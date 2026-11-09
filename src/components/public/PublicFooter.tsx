import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Heart, 
  ExternalLink,
  BookOpen,
  Layers,
  Sparkles,
  FileText,
  UserCheck,
  Lock
} from 'lucide-react';
import { PublicNavRoute } from './PublicNavbar';
import { VisitorCounterWidget } from './VisitorCounterWidget';
import { trackActionClick } from '../../lib/visitorTracker';

interface PublicFooterProps {
  onNavigate: (route: PublicNavRoute) => void;
  onOpenLogin: (tab: 'student' | 'officer') => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onNavigate,
  onOpenLogin
}) => {
  const handleLinkClick = (e: React.MouseEvent, route: PublicNavRoute) => {
    e.preventDefault();
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t-2 border-slate-800 text-xs selection:bg-sky-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-5">
        
        {/* =====================================================================
            TOP ROW: BRAND & FOUR COLUMNS (PADAT & PROPORSIONAL)
        ===================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pb-5 border-b-2 border-slate-800/80">
          
          {/* Kolom 1 & 2: Identitas Platform & Pengembang E-E-A-T */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="flex items-center space-x-3">
              <div className="bg-white px-2.5 py-1 rounded-lg border-2 border-slate-700 shadow-xs inline-block">
                <img 
                  src="/sasipedia-logo.png" 
                  alt="SASIPEDIA - Platform Asesmen Sekolah Indonesia" 
                  className="h-7 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-normal max-w-sm text-justify">
              <strong className="text-white">SASIPEDIA (Sistem Asesmen Sekolah Indonesia)</strong> adalah portal edukasi terpadu dan platform CBT multi-klaster mandiri untuk Sekolah Dasar dan Menengah. Mendukung pelaksanaan AKM, TKA, asesmen formatif, sumatif, serta pusat kreativitas guru.
            </p>

            <div className="pt-0.5 space-y-1 text-[11px]">
              <div className="flex items-center space-x-2 text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Inisiator: <strong className="text-slate-200">Agi Hamdani, M.Pd</strong> (Praktisi Evaluasi Pendidikan)</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Sumedang - Jawa Barat, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Kolom 3: Layanan Edukasi & Asesmen */}
          <div>
            <h4 className="text-[11px] font-black uppercase text-slate-200 tracking-wider mb-2 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Edukasi & Asesmen</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'wawasan-asesmen')}
                  className="hover:text-white transition-colors text-left"
                >
                  Panduan Penulisan Soal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'wawasan-asesmen')}
                  className="hover:text-white transition-colors text-left"
                >
                  Bedah Instrumen AKM
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'bank-soal')}
                  className="hover:text-white transition-colors text-left"
                >
                  Matriks Kisi-Kisi & Bank Soal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'ruang-kreativitas')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center space-x-1"
                >
                  <span>Asisten Guru AI (7 Alur)</span>
                  <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded font-bold">AI</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'ruang-kreativitas')}
                  className="hover:text-white transition-colors text-left"
                >
                  Pusat Administrasi Guru (DOCX/XLSX)
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kredibilitas & Pengembang (E-E-A-T) */}
          <div>
            <h4 className="text-[11px] font-black uppercase text-slate-200 tracking-wider mb-2 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kredibilitas & Profil</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'profil-pengembang')}
                  className="hover:text-emerald-300 font-semibold transition-colors text-left flex items-center space-x-1"
                >
                  <span>Profil Pengembang (E-E-A-T)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'about-contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Tentang Kami & Kontak Resmi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'privacy-policy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Syarat & Ketentuan
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 5: Akses Masuk Sistem CBT */}
          <div>
            <h4 className="text-[11px] font-black uppercase text-slate-200 tracking-wider mb-2 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Akses CBT & Legal</span>
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => { trackActionClick('cbt_student_exam', 'Masuk Ujian CBT Siswa'); onOpenLogin('student'); }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors text-left"
                >
                  Masuk Ujian Siswa (CBT) →
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { trackActionClick('teacher_portal_login', 'Portal Petugas & Guru'); onOpenLogin('officer'); }}
                  className="hover:text-white transition-colors text-left"
                >
                  Portal Petugas & Meja Koreksi
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleLinkClick(e, 'about-contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Saluran Bantuan & Aduan
                </button>
              </li>
              <li className="pt-1 text-[10px] text-slate-500 leading-normal text-justify">
                Memenuhi standar privasi perlindungan data peserta didik & periklanan ramah edukasi.
              </li>
            </ul>
          </div>

        </div>

        {/* =====================================================================
            BOTTOM ROW: COPYRIGHT & METADATA (COMPACT)
        ===================================================================== */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            <p>
              © {new Date().getFullYear()} <strong className="text-slate-400">SASIPEDIA</strong> — Sistem Asesmen Sekolah Indonesia.
            </p>
          </div>

          {/* Widget Statistik Pengunjung Realtime */}
          <div>
            <VisitorCounterWidget compact={true} />
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <button
              type="button"
              onClick={(e) => handleLinkClick(e, 'privacy-policy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privasi
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={(e) => handleLinkClick(e, 'terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Ketentuan
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={(e) => handleLinkClick(e, 'about-contact')}
              className="hover:text-slate-300 transition-colors"
            >
              Kontak
            </button>
            <span>•</span>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition-colors font-medium inline-flex items-center space-x-1"
              title="Peta Situs XML Resmi SASIPEDIA untuk Mesin Pencari Google"
            >
              <span>🗺️ Peta Situs</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
