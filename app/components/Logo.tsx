import Link from "next/link";

interface LogoProps {
  footer?: boolean;
  className?: string;
}

export default function Logo({ footer, className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${footer ? "logo--footer" : ""} ${className}`}
      aria-label="Localpdf home"
    >
      <svg className="logo__shield" viewBox="0 0 36 40" fill="none" aria-hidden="true">
        <path
          d="M18 2L34 10V22C34 30.5 27 37 18 38C9 37 2 30.5 2 22V10L18 2Z"
          stroke="#00E676"
          strokeWidth="2"
          fill="transparent"
        />
        <rect x="10" y="14" width="16" height="18" rx="1.5" stroke="#00E676" strokeWidth="1.5" fill="transparent" />
        <line x1="13" y1="19" x2="23" y2="19" stroke="#00E676" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="13" y1="23" x2="23" y2="23" stroke="#00E676" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="13" y1="27" x2="20" y2="27" stroke="#00E676" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="logo__wordmark">
        <span className="local">Local</span>
        <span className="pdf">pdf</span>
      </span>
    </Link>
  );
}
