"use client";

import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/components";
import { useAuth, isStaffRole } from "@/app/auth";

export interface CatalogSubservice {
  id: number;
  title: string;
  shortDescription: string | null;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export interface CatalogService {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  imageUrl: string | null;
  accentColor: string | null;
  isActive: boolean;
  subservices: CatalogSubservice[];
}

export function CatalogServicePage({
  service,
  onBook,
}: {
  service: CatalogService;
  onBook: (service: CatalogService) => void;
}) {
  const { user } = useAuth();
  const isStaff = isStaffRole(user?.role);
  const color = service.accentColor || "#F5841F";
  const dim = `${color}18`;
  const activeSubs = service.subservices.filter((s) => s.isActive);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] blur-[130px] rounded-full mix-blend-multiply opacity-[0.18]"
          style={{ background: color }}
        />
      </div>

      <div className="relative z-10 pt-16 md:pt-20 pb-32 px-6">
        <div className="w-full max-w-[1600px] mx-auto mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>
                {service.tagline || "Service"}
              </p>
              <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.1] tracking-tight mb-6 text-[#1a1a1a]">
                {service.title}
              </h1>
              <p className="text-xl md:text-2xl font-medium leading-[1.7] text-[#1a1a1a]/70 max-w-4xl">
                {service.description || "Tell us what you need and we will tailor this service around your goals."}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto rounded-[34px] overflow-hidden shadow-[0_25px_55px_-20px_rgba(0,0,0,0.22)] border border-white/60 bg-white">
                <ImageWithFallback
                  src={service.imageUrl || "/imports/image-11.png"}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1600px] mx-auto">
          <h2 className="font-extrabold text-4xl md:text-5xl tracking-tight text-[#1a1a1a] mb-8 leading-[1.15]">
            What this service includes
          </h2>

          {activeSubs.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white p-10 text-[#1a1a1a]/60 font-medium">
              No subservices published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {activeSubs.map((sub) => (
                <div key={sub.id} className="bg-white rounded-[24px] border border-white shadow-[0_15px_35px_-18px_rgba(0,0,0,0.14)] overflow-hidden">
                  <div className="h-1.5" style={{ background: color }} />
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-2xl mb-4" style={{ background: dim }} />
                    <h3 className="text-2xl font-black text-[#1a1a1a] mb-2 leading-tight">{sub.title}</h3>
                    {sub.shortDescription && (
                      <p className="text-[#1a1a1a]/65 font-medium leading-[1.7] mb-3">{sub.shortDescription}</p>
                    )}
                    {sub.description && (
                      <p className="text-sm text-[#1a1a1a]/55 font-medium leading-[1.7]">{sub.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full max-w-[1600px] mx-auto mt-16">
          <div className="w-full text-center bg-white/60 backdrop-blur-xl p-10 md:p-14 rounded-[42px] border border-white shadow-[0_20px_55px_-20px_rgba(0,0,0,0.12)]">
            <h3 className="font-extrabold text-4xl md:text-5xl text-[#1a1a1a] mb-4 tracking-tight leading-[1.15]">
              Ready to book this service?
            </h3>
            <p className="text-lg font-medium leading-[1.7] text-[#1a1a1a]/60 max-w-3xl mx-auto mb-8">
              We will save your request in the database and keep the full conversation with your team in your dashboard.
            </p>
            {!isStaff && (
              <button
                onClick={() => onBook(service)}
                className="inline-flex items-center gap-2.5 text-lg font-bold text-white px-9 py-4 rounded-full transition-transform duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-12px_rgba(0,0,0,0.35)] group"
                style={{ background: color }}
              >
                Book an appointment
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
