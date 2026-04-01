import Link from "next/link";
import { Shield, Mail } from "lucide-react";

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/mushroomidentifiers/",
    label: "Instagram",
    bg: "#E1306C",
    iconColor: "#fff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/MIdentifiers",
    label: "X (Twitter)",
    bg: "#000000",
    iconColor: "#fff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/mushroomidentifiers/",
    label: "Facebook",
    bg: "#1877F2",
    iconColor: "#fff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "https://www.pinterest.com/mushroomidentifiers/",
    label: "Pinterest",
    bg: "#E60023",
    iconColor: "#fff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/mushroom-identifiers/",
    label: "LinkedIn",
    bg: "#0A66C2",
    iconColor: "#fff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://about.me/mushroomidentifiers",
    label: "About.me",
    bg: "#00A98F",
    iconColor: "#fff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    ),
  },
];

function PaymentBadge({
  children,
  bg,
  color,
}: {
  children: React.ReactNode;
  bg: string;
  color: string;
}) {
  return (
    <div
      className="flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-bold tracking-wide select-none"
      style={{
        background: bg,
        color,
        minWidth: 52,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* ── Brand ── */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <span className="text-3xl">🍄</span>
              <span
                className="font-playfair text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Mushroom
                <span style={{ color: "var(--accent)" }}>Identifiers</span>
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              AI-powered mushroom identification for safe foraging — instant
              species ID, toxicity warnings, and look-alike alerts.
            </p>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              Trusted by foragers, hikers, and mycology enthusiasts worldwide.
              Upload a photo and get expert-level analysis in seconds.
            </p>
            <p
              className="text-sm leading-relaxed mb-5 font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Free to start — no signup required.
            </p>
            <a
              href="mailto:support@mushroomidentifiers.com"
              className="flex items-center gap-2 text-sm hover:underline mb-5 w-fit"
              style={{ color: "var(--text-muted)" }}
            >
              <Mail
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "var(--accent)" }}
              />
              support@mushroomidentifiers.com
            </a>
            <div className="flex items-center flex-wrap gap-2">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{ background: item.bg, color: item.iconColor }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Explore ── */}
          <div>
            <h4
              className="font-semibold mb-5 text-sm uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              Explore
            </h4>
            <ul className="space-y-3 mb-6">
              {[
                { href: "/#identifier", label: "Mushroom Identifier" },
                { href: "/#features", label: "Toxicity Warnings" },
                { href: "/#lookalikes", label: "Similar Species" },
                { href: "/mushroom-identification-quiz", label: "ID Quiz" },
                { href: "/blog", label: "Species Blog" },
                { href: "/dashboard", label: "Field Journal" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-all hover:translate-x-1 inline-block hover:opacity-100"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* ShowMeBestAI Badge below Field Journal */}
            <div className="pt-2">
              <a
                href="https://showmebest.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://showmebest.ai/badge/feature-badge-white.webp"
                  alt="Featured on ShowMeBestAI"
                  width="180"
                  height="49"
                  className="rounded shadow-sm hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* ── Company ── */}
          <div>
            <h4
              className="font-semibold mb-5 text-sm uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              Company
            </h4>
            <ul className="space-y-3 mb-6">
              {[
                { href: "/about", label: "About Us" },
                { href: "/pricing", label: "Pricing" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-all hover:translate-x-1 inline-block hover:opacity-100"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Fazier Badge below Terms of Service */}
            <div className="pt-2">
              <a
                href="https://fazier.com/launches/mushroomidentifiers.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light"
                  width="120"
                  alt="Fazier badge"
                  className="hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* ── Secure Payment ── */}
          <div>
            <h4
              className="font-semibold mb-5 text-sm uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              Secure Payment
            </h4>

            <div
              className="p-4 rounded-xl mb-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Guaranteed
                  </p>
                  <p
                    className="text-sm font-bold leading-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Secure Payment
                  </p>
                </div>
              </div>
              <p
                className="text-xs mt-2"
                style={{ color: "var(--text-muted)" }}
              >
                256-bit SSL encryption · No hidden charges
              </p>
            </div>

            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              We Accept
            </p>
            <div className="flex flex-wrap gap-2">
              <PaymentBadge bg="#1A1F71" color="#fff">
                VISA
              </PaymentBadge>
              <div
                className="flex items-center justify-center px-2 py-1.5 rounded-md gap-0.5"
                style={{
                  background: "#252525",
                  minWidth: 52,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="w-4 h-4 rounded-full inline-block"
                  style={{ background: "#EB001B" }}
                />
                <span
                  className="w-4 h-4 rounded-full inline-block -ml-2"
                  style={{ background: "#F79E1B", opacity: 0.9 }}
                />
              </div>
              <PaymentBadge bg="#003087" color="#fff">
                Pay<span style={{ color: "#009CDE" }}>Pal</span>
              </PaymentBadge>
              <PaymentBadge bg="#2E77BC" color="#fff">
                AMEX
              </PaymentBadge>
              <PaymentBadge bg="#000" color="#fff">
                ⌘ Pay
              </PaymentBadge>
              <PaymentBadge bg="#fff" color="#3c4043">
                G Pay
              </PaymentBadge>
              <PaymentBadge bg="#635BFF" color="#fff">
                stripe
              </PaymentBadge>
            </div>

            <Link
              href="/pricing"
              className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 glow-green"
              style={{
                background: "var(--btn-primary)",
                color: "#fff",
                display: "flex",
              }}
            >
              ✦ Get Premium Access
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            © 2026 MushroomIdentifiers.com · All rights reserved · Educational
            purposes only
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs hover:underline"
              style={{ color: "var(--text-faint)" }}
            >
              Privacy
            </Link>
            <span style={{ color: "var(--border-hover)" }}>·</span>
            <Link
              href="/terms"
              className="text-xs hover:underline"
              style={{ color: "var(--text-faint)" }}
            >
              Terms
            </Link>
            <span style={{ color: "var(--border-hover)" }}>·</span>
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>
              English only
            </span>
          </div>
        </div>
      </div>

      {/* ── Safety disclaimer ── */}
      <div
        className="px-6 py-3.5 text-center"
        style={{
          background: "var(--accent-bg)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <p
          className="text-xs font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          ⚠️ Never consume any wild mushroom based solely on AI identification.
          Always consult a professional mycologist.
        </p>
      </div>
    </footer>
  );
}
