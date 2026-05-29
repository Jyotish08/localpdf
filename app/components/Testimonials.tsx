import Reveal from "./Reveal";

const testimonials = [
  {
    quote: "Compresses large PDFs instantly and keeps everything private.",
    name: "Rohit Sharma",
    role: "Product Manager",
    initials: "RS",
    avatarClass: "bg-[var(--accent-dim)]",
    delay: 0,
  },
  {
    quote: "The best PDF tool I've used. Fast, simple, and 100% offline.",
    name: "Ananya Verma",
    role: "UX Designer",
    initials: "AV",
    avatarClass: "bg-[#7D3C98]",
    delay: 150,
  },
  {
    quote: "Finally, a tool that doesn't upload my files anywhere. Love it!",
    name: "Arjun Patel",
    role: "Software Engineer",
    initials: "AP",
    avatarClass: "bg-[#2874A6]",
    delay: 300,
  },
];

export default function Testimonials() {
  return (
    <section className="px-4 py-12 sm:py-16 lg:py-20" id="blog">
      <div className="container-lp">
        <Reveal>
          <h2 className="mb-8 text-center text-[28px] font-bold text-foreground">
            Loved by people who value privacy
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Reveal key={t.name} delay={t.delay}>
              <article className="testimonial-lp h-full">
                <div className="text-base tracking-widest text-accent" aria-label="5 stars">
                  ★★★★★
                </div>
                <p className="flex-1 text-sm italic leading-relaxed text-body">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-auto flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-foreground ${t.avatarClass}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-[13px] text-muted">{t.role}</div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
