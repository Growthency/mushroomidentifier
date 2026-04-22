import Link from "next/link";
import { Shield, Mail, Gift, Sparkles, Check } from "lucide-react";
import type { MenuItem } from "@/lib/menus";
import type { SocialLink, PaymentMethod, FooterBadge } from "@/lib/site-content";

// =============================================================================
// FALLBACKS — used only when admin-managed content is empty / migration not applied
// =============================================================================
const FALLBACK_EXPLORE: { href: string; label: string; target: "_self" | "_blank" }[] = [
  { href: "/#identifier", label: "Mushroom Identifier", target: "_self" },
  { href: "/mushroom-parts-explained", label: "Mushroom Parts", target: "_self" },
  { href: "/mushroom-identifier-book", label: "Mushroom Identifier Book", target: "_self" },
  { href: "/mushroom-identification-quiz", label: "Mushroom identification Quiz", target: "_self" },
  { href: "/blog", label: "Mushrooms Blog", target: "_self" },
  { href: "/pricing", label: "Mushroom Identification Price", target: "_self" },
];

const FALLBACK_COMPANY: { href: string; label: string; target: "_self" | "_blank" }[] = [
  { href: "/about", label: "About Us", target: "_self" },
  { href: "/pricing", label: "Pricing", target: "_self" },
  { href: "/blog", label: "Blog", target: "_self" },
  { href: "/contact", label: "Contact", target: "_self" },
  { href: "/privacy", label: "Privacy Policy", target: "_self" },
  { href: "/terms", label: "Terms of Service", target: "_self" },
  { href: "/refund", label: "Refund Policy", target: "_self" },
];

const FALLBACK_BOTTOM: { href: string; label: string; target: "_self" | "_blank" }[] = [
  { href: "/privacy", label: "Privacy", target: "_self" },
  { href: "/terms", label: "Terms", target: "_self" },
  { href: "/refund", label: "Refund Policy", target: "_self" },
];

// Detects whether a brand-logo value should be rendered as an image (URL / path)
// or as plain text (emoji / glyph). Admins can paste either into the same field.
const isImageLogo = (v: string): boolean =>
  /^(\/|https?:\/\/|data:image\/)/i.test(v) || /\.(png|jpe?g|svg|webp|gif|avif)(\?|$)/i.test(v)

const FALLBACK_SETTINGS: Record<string, string> = {
  brand_logo_emoji:        "/logo-header.png",
  brand_name_prefix:       "Mushroom",
  brand_name_suffix:       "Identifiers",
  footer_description_1:    "AI-powered mushroom identification for safe foraging — instant species ID, toxicity warnings, and look-alike alerts.",
  footer_description_2:    "Trusted by foragers, hikers, and mycology enthusiasts worldwide. Upload a photo and get expert-level analysis in seconds.",
  footer_highlight:        "Free to start — no signup required.",
  contact_email:           "support@mushroomidentifiers.com",
  cta_heading:             "Start Identifying Safely Today",
  cta_subtitle:            "Join thousands of foragers using AI-powered identification",
  cta_primary_text:        "Try Free — No Signup →",
  cta_primary_href:        "/#identifier",
  cta_secondary_text:      "View Pricing",
  cta_secondary_href:      "/pricing",
  payment_heading:         "Secure Payment",
  payment_badge_label:     "Guaranteed",
  payment_badge_sublabel:  "Secure Payment",
  payment_description:     "256-bit SSL encryption · No hidden charges",
  payment_accept_label:    "We Accept",
  premium_cta_text:        "✦ Get Premium Access",
  premium_cta_href:        "/pricing",
  footer_explore_heading:  "Explore",
  footer_company_heading:  "Company",
  copyright_text:          "© 2026 MushroomIdentifiers.com · All rights reserved · Educational purposes only",
  safety_disclaimer:       "⚠️ Never consume any wild mushroom based solely on AI identification. Always consult a professional mycologist.",
};

const FALLBACK_SOCIALS: SocialLink[] = [
  { id: "i",  label: "Instagram",   href: "https://www.instagram.com/mushroomidentifiers/",   bg_color: "#E1306C", icon_color: "#ffffff", sort_order: 1, enabled: true, icon_svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>' },
  { id: "x",  label: "X (Twitter)", href: "https://x.com/MIdentifiers",                       bg_color: "#000000", icon_color: "#ffffff", sort_order: 2, enabled: true, icon_svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>' },
  { id: "f",  label: "Facebook",    href: "https://www.facebook.com/mushroomidentifiers/",    bg_color: "#1877F2", icon_color: "#ffffff", sort_order: 3, enabled: true, icon_svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>' },
  { id: "p",  label: "Pinterest",   href: "https://www.pinterest.com/mushroomidentifiers/",   bg_color: "#E60023", icon_color: "#ffffff", sort_order: 4, enabled: true, icon_svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>' },
  { id: "l",  label: "LinkedIn",    href: "https://www.linkedin.com/company/mushroom-identifiers/", bg_color: "#0A66C2", icon_color: "#ffffff", sort_order: 5, enabled: true, icon_svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>' },
  { id: "a",  label: "About.me",    href: "https://about.me/mushroomidentifiers",             bg_color: "#00A98F", icon_color: "#ffffff", sort_order: 6, enabled: true, icon_svg: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>' },
];

const FALLBACK_PAYMENTS: PaymentMethod[] = [
  { id: "v", label: "VISA",       display_html: "VISA",                                                     bg_color: "#1A1F71", text_color: "#ffffff", sort_order: 1, enabled: true },
  { id: "m", label: "MasterCard", display_html: '<span style="width:16px;height:16px;border-radius:9999px;display:inline-block;background:#EB001B"></span><span style="width:16px;height:16px;border-radius:9999px;display:inline-block;background:#F79E1B;opacity:0.9;margin-left:-8px"></span>', bg_color: "#252525", text_color: "#ffffff", sort_order: 2, enabled: true },
  { id: "pp", label: "PayPal",    display_html: 'Pay<span style="color:#009CDE">Pal</span>',                bg_color: "#003087", text_color: "#ffffff", sort_order: 3, enabled: true },
  { id: "ax", label: "AMEX",      display_html: "AMEX",                                                     bg_color: "#2E77BC", text_color: "#ffffff", sort_order: 4, enabled: true },
  { id: "ap", label: "Apple Pay", display_html: "⌘ Pay",                                                    bg_color: "#000000", text_color: "#ffffff", sort_order: 5, enabled: true },
  { id: "gp", label: "Google Pay", display_html: "G Pay",                                                   bg_color: "#ffffff", text_color: "#3c4043", sort_order: 6, enabled: true },
  { id: "pd", label: "Paddle",    display_html: "Paddle",                                                   bg_color: "#0070E0", text_color: "#ffffff", sort_order: 7, enabled: true },
  { id: "2c", label: "2Checkout", display_html: "2Checkout",                                                bg_color: "#E2342D", text_color: "#ffffff", sort_order: 8, enabled: true },
];

const FALLBACK_EXPLORE_BADGES: FooterBadge[] = [
  { id: "smb", location: "footer_explore", image_url: "https://showmebest.ai/badge/feature-badge-white.webp", link_url: "https://showmebest.ai", alt_text: "Featured on ShowMeBestAI", width: 180, height: 49, sort_order: 1, enabled: true },
];
const FALLBACK_COMPANY_BADGES: FooterBadge[] = [
  { id: "faz", location: "footer_company", image_url: "https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light", link_url: "https://fazier.com/launches/mushroomidentifiers.com", alt_text: "Fazier badge", width: 120, height: null, sort_order: 1, enabled: true },
];

// =============================================================================
// Footer component
// =============================================================================
export default function Footer({
  footerExplore,
  footerCompany,
  footerBottom,
  settings,
  socialLinks,
  paymentMethods,
  exploreBadges,
  companyBadges,
}: {
  footerExplore?: MenuItem[]
  footerCompany?: MenuItem[]
  footerBottom?: MenuItem[]
  settings?: Record<string, string>
  socialLinks?: SocialLink[]
  paymentMethods?: PaymentMethod[]
  exploreBadges?: FooterBadge[]
  companyBadges?: FooterBadge[]
} = {}) {
  // Resolve menu columns
  const exploreLinks =
    footerExplore && footerExplore.length > 0
      ? footerExplore.map((m) => ({ href: m.url, label: m.label, target: m.target }))
      : FALLBACK_EXPLORE
  const companyLinks =
    footerCompany && footerCompany.length > 0
      ? footerCompany.map((m) => ({ href: m.url, label: m.label, target: m.target }))
      : FALLBACK_COMPANY
  const bottomLinks =
    footerBottom && footerBottom.length > 0
      ? footerBottom.map((m) => ({ href: m.url, label: m.label, target: m.target }))
      : FALLBACK_BOTTOM

  // Resolve settings with fallback per-key (so partial migration doesn't break layout)
  const s = (key: string): string => settings?.[key] || FALLBACK_SETTINGS[key] || ""

  // Resolve repeatable content
  const socials   = socialLinks && socialLinks.length > 0     ? socialLinks      : FALLBACK_SOCIALS
  const payments  = paymentMethods && paymentMethods.length > 0 ? paymentMethods : FALLBACK_PAYMENTS
  const eBadges   = exploreBadges && exploreBadges.length > 0 ? exploreBadges    : FALLBACK_EXPLORE_BADGES
  const cBadges   = companyBadges && companyBadges.length > 0 ? companyBadges    : FALLBACK_COMPANY_BADGES

  return (
    <>
      {/* ── Sitewide CTA — appears above footer on every page ── */}
      <section className="py-14 sm:py-20 px-6 relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
        {/* Ambient radial glows — two layered orbs for depth */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
          />
          <div
            className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-3xl opacity-15"
            style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Launch-offer pill — eye-catching ribbon at the top */}
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase"
              style={{
                background: "linear-gradient(90deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))",
                border: "1px solid rgba(16,185,129,0.35)",
                color: "#10b981",
              }}
            >
              <Gift className="w-4 h-4" />
              <span>Launch Offer · 7 Days Free · 50% Off First Month</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Heading */}
          <h2
            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {s("cta_heading")}
          </h2>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg md:text-xl text-center mb-8 max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            {s("cta_subtitle")}
          </p>

          {/* Primary + secondary buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            <Link
              href={s("cta_primary_href")}
              className="px-8 py-4 rounded-full text-base sm:text-lg font-semibold glow-green hover:scale-[1.03] transition-all shadow-lg"
              style={{
                background: "var(--btn-primary)",
                color: "#fff",
                boxShadow: "0 10px 30px -10px rgba(16,185,129,0.6)",
              }}
            >
              {s("cta_primary_text")}
            </Link>
            <Link
              href={s("cta_secondary_href")}
              className="px-8 py-4 rounded-full text-base sm:text-lg font-semibold hover:border-emerald-400 transition-all"
              style={{ border: "2px solid var(--border)", color: "var(--text-primary)" }}
            >
              {s("cta_secondary_text")}
            </Link>
          </div>

          {/* Trust-signal strip — five green checks in a flexible row */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
            {[
              "7-day free trial",
              "50% off first month",
              "14-day refund",
              "Cancel anytime",
              "No credit card to try free",
            ].map((text) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#10b981" }} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* ── Brand column ── */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4 w-fit" aria-label="Mushroom Identifiers home">
                {isImageLogo(s("brand_logo_emoji")) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={s("brand_logo_emoji")}
                    alt={`${s("brand_name_prefix")}${s("brand_name_suffix")} logo`}
                    width={40}
                    height={40}
                    className="rounded-lg object-contain select-none"
                    style={{ width: 40, height: 40 }}
                  />
                ) : (
                  <span className="text-3xl select-none">{s("brand_logo_emoji")}</span>
                )}
                <span className="font-playfair text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {s("brand_name_prefix")}<span style={{ color: "var(--accent)" }}>{s("brand_name_suffix")}</span>
                </span>
              </Link>
              {s("footer_description_1") && (
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>{s("footer_description_1")}</p>
              )}
              {s("footer_description_2") && (
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>{s("footer_description_2")}</p>
              )}
              {s("footer_highlight") && (
                <p className="text-sm leading-relaxed mb-5 font-medium" style={{ color: "var(--text-muted)" }}>{s("footer_highlight")}</p>
              )}
              {s("contact_email") && (
                <a href={`mailto:${s("contact_email")}`} className="flex items-center gap-2 text-sm hover:underline mb-5 w-fit" style={{ color: "var(--text-muted)" }}>
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                  {s("contact_email")}
                </a>
              )}
              <div className="flex items-center flex-wrap gap-2">
                {socials.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-label={item.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ background: item.bg_color, color: item.icon_color }}
                    dangerouslySetInnerHTML={{ __html: item.icon_svg }}
                  />
                ))}
              </div>
            </div>

            {/* ── Explore column ── */}
            <div>
              <div className="font-semibold mb-5 uppercase tracking-widest" style={{ color: "var(--accent)", fontSize: "0.875rem" }}>
                {s("footer_explore_heading")}
              </div>
              <ul className="space-y-3 mb-6">
                {exploreLinks.map(({ href, label, target }) => (
                  <li key={`${href}-${label}`}>
                    <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}
                          className="text-sm transition-all hover:translate-x-1 inline-block hover:opacity-100"
                          style={{ color: "var(--text-muted)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              {eBadges.map((b) => (
                <div className="pt-2" key={b.id}>
                  <a href={b.link_url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.image_url} alt={b.alt_text || ""} width={b.width} height={b.height || undefined}
                         className="rounded shadow-sm hover:opacity-90 transition-opacity" />
                  </a>
                </div>
              ))}
            </div>

            {/* ── Company column ── */}
            <div>
              <div className="font-semibold mb-5 uppercase tracking-widest" style={{ color: "var(--accent)", fontSize: "0.875rem" }}>
                {s("footer_company_heading")}
              </div>
              <ul className="space-y-3 mb-6">
                {companyLinks.map(({ href, label, target }) => (
                  <li key={`${href}-${label}`}>
                    <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}
                          className="text-sm transition-all hover:translate-x-1 inline-block hover:opacity-100"
                          style={{ color: "var(--text-muted)" }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              {cBadges.map((b) => (
                <div className="pt-2" key={b.id}>
                  <a href={b.link_url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.image_url} alt={b.alt_text || ""} width={b.width} height={b.height || undefined}
                         className="hover:opacity-90 transition-opacity" />
                  </a>
                </div>
              ))}
            </div>

            {/* ── Secure Payment column ── */}
            <div>
              <div className="font-semibold mb-5 uppercase tracking-widest" style={{ color: "var(--accent)", fontSize: "0.875rem" }}>
                {s("payment_heading")}
              </div>

              <div className="p-4 rounded-xl mb-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)", color: "#fff" }}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                      {s("payment_badge_label")}
                    </p>
                    <p className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                      {s("payment_badge_sublabel")}
                    </p>
                  </div>
                </div>
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  {s("payment_description")}
                </p>
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                {s("payment_accept_label")}
              </p>
              <div className="flex flex-wrap gap-2">
                {payments.map((p) => (
                  <div key={p.id}
                       aria-label={p.label}
                       className="flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-bold tracking-wide select-none"
                       style={{ background: p.bg_color, color: p.text_color, minWidth: 52, border: "1px solid rgba(0,0,0,0.08)" }}
                       dangerouslySetInnerHTML={{ __html: p.display_html }} />
                ))}
              </div>

              <Link href={s("premium_cta_href")}
                    className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 glow-green"
                    style={{ background: "var(--btn-primary)", color: "#fff", display: "flex" }}>
                {s("premium_cta_text")}
              </Link>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              {s("copyright_text")}
            </p>
            <div className="flex items-center gap-4">
              {bottomLinks.map(({ href, label, target }, idx) => (
                <span key={`${href}-${label}`} className="flex items-center gap-4">
                  {idx > 0 && <span style={{ color: "var(--border-hover)" }}>·</span>}
                  <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}
                        className="text-xs hover:underline" style={{ color: "var(--text-faint)" }}>
                    {label}
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Safety disclaimer ── */}
        {s("safety_disclaimer") && (
          <div className="px-6 py-3.5 text-center" style={{ background: "var(--accent-bg)", borderTop: "1px solid var(--border)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
              {s("safety_disclaimer")}
            </p>
          </div>
        )}
      </footer>
    </>
  );
}
