import Reveal from "./Reveal";

const items = [
  { label: "No Install", delay: 0 },
  { label: "No Account", delay: 100 },
  { label: "No File Uploads", delay: 200 },
  { label: "AES-256", delay: 300 },
  { label: "Free", delay: 400 },
];

export default function TrustBar() {
  return (
    <Reveal className="bar-card trust-bar mx-auto mt-8 flex flex-wrap items-stretch justify-around gap-4">
      {items.map((item) => (
        <Reveal
          key={item.label}
          delay={item.delay}
          className="relative flex min-w-[100px] flex-1 flex-col items-center px-3 py-2 text-center"
        >
          <svg className="h-7 w-7 text-accent" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M9 14l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mt-2 text-[13px] font-medium text-body">{item.label}</span>
        </Reveal>
      ))}
    </Reveal>
  );
}
