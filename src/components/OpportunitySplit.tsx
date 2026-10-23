import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    title: "Business travel",
    text: "Smarter mobility for your team and clients.",
    href: "/business",
    image: "/images/business.webp",
    alt: "A business traveller in the back of a Sanga ride",
  },
  {
    title: "Fleet partnerships",
    text: "Manage vehicles, drivers and operations with confidence.",
    href: "/fleet",
    image: "/images/fleet.webp",
    alt: "A row of fleet vehicles outside an office building",
  },
];

export function OpportunitySplit() {
  return (
    <section aria-labelledby="opportunity-title">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 id="opportunity-title" className="heading-lg max-w-xl">
            More ways to
            <br />
            move forward.
          </h2>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
            Drive, book for your team or partner with Sanga. Flexible opportunities for individuals and businesses.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <Link
            href="/drive"
            className="group relative isolate flex min-h-[380px] flex-col justify-end overflow-hidden rounded-[2rem] bg-navy-900 p-7 text-white sm:p-10 lg:min-h-[460px]"
          >
            <Image
              src="/images/driver.webp"
              alt="A smiling Sanga driver holding his phone"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="-z-10 object-cover object-[70%_center] transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
            <h3 className="text-[1.9rem] leading-[1.05] font-extrabold tracking-[-0.03em]">Drive with Sanga</h3>
            <p className="mt-2 max-w-sm text-[0.95rem] text-white/80">Flexible work, transparent information and support.</p>
            <span className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition group-hover:bg-brand-50">
              Learn more <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          <div className="grid grid-cols-1 gap-5">
            {partners.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group grid grid-cols-1 overflow-hidden rounded-[2rem] border border-slate-100 bg-white transition hover:shadow-card sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]"
              >
                <span className="relative block aspect-[16/9] overflow-hidden sm:aspect-auto sm:min-h-[210px]">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 260px, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-col justify-center p-6 sm:p-8">
                  <span className="block text-xl font-extrabold tracking-tight">{p.title}</span>
                  <span className="mt-2 block text-[0.9rem] leading-relaxed text-muted">{p.text}</span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-all group-hover:gap-3">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
