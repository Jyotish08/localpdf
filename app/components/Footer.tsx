import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 pb-20 pt-12 sm:pb-8">
      <div className="container-lp grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo footer />
          <p className="mt-2 text-[13px] text-muted">Your PDFs. Private. Fast. Done.</p>
        </div>

        <div>
          <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-foreground">Product</h3>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link href="/#features" className="text-[13px] text-muted transition hover:text-accent">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="text-[13px] text-muted transition hover:text-accent">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/compress" className="text-[13px] text-muted transition hover:text-accent">
                Compress
              </Link>
            </li>
            <li>
              <Link href="/merge" className="text-[13px] text-muted transition hover:text-accent">
                Merge
              </Link>
            </li>
            <li>
              <Link href="/split" className="text-[13px] text-muted transition hover:text-accent">
                Split
              </Link>
            </li>
            <li>
              <Link href="/signature" className="text-[13px] text-muted transition hover:text-accent">
                Signature
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-foreground">Company</h3>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link href="/about" className="text-[13px] text-muted transition hover:text-accent">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="text-[13px] text-muted transition hover:text-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-[13px] text-muted transition hover:text-accent">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[13px] text-muted transition hover:text-accent">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="container-lp mt-8 border-t border-border pt-6 text-center text-[13px] text-muted">
        © {new Date().getFullYear()} Localpdf. All rights reserved.
      </p>
    </footer>
  );
}
