import React from 'react';

const SponsorsCarousel = () => {
  const technologies = [
    { name: 'Meta', slug: 'meta', color: 'ffffff' },
    { name: 'Google', slug: 'google', color: '' },
    { name: 'WhatsApp', slug: 'whatsapp', color: '' },
    { name: 'OpenAI', slug: 'openai', color: 'ffffff' },
    { name: 'Anthropic', slug: 'anthropic', color: 'ffffff' },
    { name: 'Supabase', slug: 'supabase', color: '' },
    { name: 'Mercado Pago', slug: 'mercadopago', color: '' },
    { name: 'Neon', slug: 'neondottech', color: '' },
    { name: 'Stripe', slug: 'stripe', color: '' },
    { name: 'Amazon', slug: 'amazon', color: 'ffffff' },
    { name: 'Microsoft', slug: 'microsoft', color: '' },
  ];

  // Duplicamos para loop infinito perfeito
  const displayLogos = [...technologies, ...technologies, ...technologies];

  return (
    <section className="py-20 lg:py-32 bg-[#020617] relative overflow-hidden border-y border-white/5">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Empresas e tecnologias que impulsionam o <span className="text-emerald-500">INOVACHAT</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-[700px] mx-auto font-medium leading-relaxed">
            Integramos tecnologia de ponta para entregar automação, IA e atendimento inteligente em escala global.
          </p>
        </div>

        <div className="relative group pause-on-hover">
          {/* Fades laterais premium */}
          <div className="absolute left-0 top-0 h-full w-24 md:w-64 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 md:w-64 bg-gradient-to-l from-[#020617] via-[#020617]/80 to-transparent z-20 pointer-events-none" />

          <div className="flex gap-6 md:gap-8 animate-scroll-x whitespace-nowrap items-center py-4">
            {displayLogos.map((tech, index) => (
              <div 
                key={`${tech.slug}-${index}`}
                className="flex-shrink-0 group/card"
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-5 min-w-[140px] md:min-w-[180px] h-20 md:h-24 flex items-center justify-center transition-all duration-300 group-hover/card:border-emerald-500/30 group-hover/card:bg-white/[0.08] group-hover/card:scale-105 shadow-xl">
                  <img 
                    src={`https://cdn.simpleicons.org/${tech.slug}${tech.color ? '/' + tech.color : ''}`} 
                    alt={tech.name}
                    className="h-8 md:h-10 w-auto object-contain transition-all duration-500 group-hover/card:brightness-125"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="hidden text-white/40 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                    {tech.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsCarousel;
