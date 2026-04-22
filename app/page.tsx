import dynamic from "next/dynamic";
import Link from "next/link";
import NextImage from "next/image";
import {
  Shield,
  Microscope,
  Globe,
  Clock,
  BookOpen,
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle,
  Camera,
  TreeDeciduous,
  Leaf,
  Mountain,
} from "lucide-react";

import HeroH1 from "./HeroH1";
import IdentifyBanner from "@/components/blog/IdentifyBanner";
import HomepageBlocks from "@/components/homepage/HomepageBlocks";
import { getHomepageBlocks } from "@/lib/homepage-blocks";
import { getSiteContent } from "@/lib/site-content";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });
const HomeIdentifier = dynamic(() => import("./HomeIdentifier"), {
  ssr: false,
});
// HomeReviews import removed — component no longer rendered on homepage.
const ScrollGlow = dynamic(() => import("./ScrollGlow"), { ssr: false });

const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://mushroomidentifiers.com/#app",
      name: "Mushroom Identifier",
      url: "https://mushroomidentifiers.com/",
      applicationCategory: "EducationalApplication",
      operatingSystem: "All",
      description:
        "AI mushroom identifier to identify wild mushrooms by picture using computer vision, cap, gills, pores, stem, and habitat analysis.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "128",
      },
      publisher: { "@id": "https://mushroomidentifiers.com/#organization" },
    },
    {
      "@type": "Article",
      "@id": "https://mushroomidentifiers.com/#article",
      headline:
        "Mushroom Identifier - Free Fungi Identification Tool by Picture",
      description:
        "Identify mushrooms by picture using AI. Upload photos to detect fungal species, gills, pores, and habitat instantly.",
      author: {
        "@type": "Organization",
        name: "Mushroom Identifier",
        url: "https://mushroomidentifiers.com/",
      },
      publisher: { "@id": "https://mushroomidentifiers.com/#organization" },
      mainEntityOfPage: "https://mushroomidentifiers.com/",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://mushroomidentifiers.com/",
        },
      ],
    },
    {
      "@type": "HowTo",
      name: "Mushroom Identification Guide",
      step: [
        { "@type": "HowToStep", name: "Observe shape", text: "Check shape and growth pattern." },
        { "@type": "HowToStep", name: "Check cap", text: "Analyze cap shape, texture, and color." },
        { "@type": "HowToStep", name: "Inspect underside", text: "Identify gills, pores, or ridges." },
        { "@type": "HowToStep", name: "Check stem", text: "Look for ring, thickness, and base." },
        { "@type": "HowToStep", name: "Identify habitat", text: "Note wood, soil, or grass location." },
        { "@type": "HowToStep", name: "Spore print", text: "Confirm using spore color." },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How accurate is the mushroom identifier?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Uses AI with multi-angle analysis for high accuracy but results should be verified.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use it offline?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, it requires internet connection.",
          },
        },
        {
          "@type": "Question",
          name: "What if I ate a poisonous mushroom?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Seek emergency medical help immediately.",
          },
        },
        {
          "@type": "Question",
          name: "Can I identify mushrooms from photos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, upload clear images for analysis.",
          },
        },
        {
          "@type": "Question",
          name: "Is it free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, 30 free credits available.",
          },
        },
        {
          "@type": "Question",
          name: "How many photos are needed?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "At least cap, gills, stem, and base.",
          },
        },
        {
          "@type": "Question",
          name: "Does it work worldwide?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, global coverage.",
          },
        },
        {
          "@type": "Question",
          name: "Can beginners use it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, simple and beginner-friendly.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need an account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, signup required for credits.",
          },
        },
        {
          "@type": "Question",
          name: "Is there a limit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "30 free credits, then subscription.",
          },
        },
      ],
    },
  ],
};

export default async function Home() {
  // Admin-managed homepage blocks (between upload widget and reviews section).
  // Empty array → site renders the hardcoded default middle content below.
  const homepageBlocks = await getHomepageBlocks();
  const useCustomBlocks = homepageBlocks.length > 0;

  // Admin-editable hero text. Blank values fall back to the original hardcoded
  // strings so the hero never renders empty on a cold DB or mid-edit blip.
  const { settings: siteSettings } = await getSiteContent();
  const heroTitle =
    siteSettings.hero_title?.trim() ||
    "Mushroom Identifier - Free Mushroom Identification App by Picture";
  const heroSubtitle =
    siteSettings.hero_subtitle?.trim() ||
    "Use our Free mushroom identifier by photo for fast, accurate results with advanced mushroom identifier AI. Upload clear images from multiple angles to instantly identify fungi, detect key features, and receive toxicity warnings plus similar species alerts through our free mushroom identification app.";
  const heroEyebrow =
    siteSettings.hero_eyebrow === undefined
      ? "AI-POWERED · 10,000+ SPECIES · 3 FREE SCANS"
      : siteSettings.hero_eyebrow.trim();

  return (
    <div id="homepage-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />
      <ScrollGlow />
      <section
        className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20"
        style={{ background: "transparent" }}
      >
        {/* Ambient radial glow — pure CSS, zero JS */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--hero-ambient)" }}
        />
        <HeroCanvas />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {heroEyebrow && (
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-medium tracking-wide"
              style={{
                background: "var(--accent-bg)",
                color: "var(--accent)",
                border: "1px solid var(--border-hover)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full pulse-dot"
                style={{ background: "var(--accent)" }}
              />
              {heroEyebrow}
            </div>
          )}

          {/* HeroH1 renders solid color server-side (LCP-safe), adds shimmer client-side */}
          <HeroH1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            {heroTitle}
          </HeroH1>

          <p
            className="text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#identifier"
              className="px-8 py-4 rounded-full text-lg font-semibold glow-green transition-all"
              style={{ background: "var(--btn-primary)", color: "#fff" }}
            >
              Identify a Mushroom →
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-full text-lg font-semibold transition-all"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              See How It Works
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { label: "10K+ Species", icon: Globe },
              { label: "95% Accuracy", icon: CheckCircle },
              { label: "<60s Results", icon: Clock },
              { label: "3 Free Scans", icon: Shield },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <stat.icon
                  className="w-6 h-6"
                  style={{ color: "var(--accent)" }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center gap-2 animate-scroll-bounce">
            <div
              className="w-px h-12"
              style={{ background: "var(--border)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>
              scroll
            </span>
          </div>
        </div>
      </section>

      <HomeIdentifier />

      {/* === BEGIN admin-editable homepage middle === */}
      {/* If the admin has published any homepage_blocks, they replace the
          hardcoded content below. Otherwise the original sections render
          unchanged (safe rollout). Edit via /admin/homepage. */}
      {useCustomBlocks ? (
        <HomepageBlocks blocks={homepageBlocks} />
      ) : (
        <>
      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Free Mushroom Identification App by Photos
          </h2>
          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed mb-12"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              By uploading clear images showing the cap, gills, pores, stem, and
              surrounding habitat, the system extracts visual traits such as cap
              shape, gill pattern, surface texture, and stem structure, then
              returns a ranked list of possible species matches.
            </p>
            <p>
              Many people use a wild mushroom identifier by picture when hiking,
              exploring forests, or observing fungi in gardens and parks. These
              tools often work as a mushroom identifier app or web-based
              identifier that runs directly in a browser. Some platforms also
              include a helpful mushroom ID chart, allowing users to compare key
              identification features such as gill attachment, cap shape, spore
              structures, and habitat clues to better understand mushroom
              anatomy.
            </p>
            <p>
              A mushroom identifier is especially useful for hikers, mushroom
              foragers, students of mycology, nature photographers, and outdoor
              enthusiasts who want to quickly research unknown fungi. By
              combining photo analysis, habitat context, and geographic
              information, the tool can narrow down potential species far faster
              than manually searching through traditional field guides or fungal
              reference books.
            </p>
          </div>

              {/* Visual break — forest floor mushrooms */}
          <div className="relative rounded-2xl overflow-hidden mt-8" style={{ border: '1px solid var(--border)' }}>
            <NextImage
              src="/wild-mushrooms-forest-floor.webp"
              alt="Mushroom identification app — Amanita muscaria (fly agaric) in natural forest habitat"
              width={1200}
              height={500}
              loading="lazy"
              className="w-full h-auto"
              style={{ display: 'block', maxHeight: '400px', objectFit: 'cover' }}
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
              <p className="text-xs text-white/70 m-0">Photo by Flocci Nivis · Wikimedia Commons · CC BY 4.0</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-primary)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="p-6 sm:p-8 rounded-xl mb-12"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "2px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 flex-shrink-0 text-red-500" />
              <div>
                <h2 className="font-semibold text-xl mb-3 text-red-500">
                  Important Safety Notice
                </h2>
                <p
                  className="text-base leading-relaxed mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  However, a mushroom identifier should always be used as a
                  learning and research aid, not as a final identification
                  authority. Some poisonous mushrooms closely resemble edible
                  ones. For example,{" "}
                  <Link href="/amanita-phalloides-death-cap" style={{ color: "var(--accent)" }} className="hover:underline"><strong>Amanita phalloides (death cap)</strong></Link> — one of the
                  most toxic mushrooms in the world — can look similar to edible
                  species when young.
                </p>
                <p
                  className="text-base leading-relaxed font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  For safety, never rely solely on an AI result to determine
                  edibility and always consult a local mycologist or mycological
                  society for expert confirmation.
                </p>
              </div>
            </div>
          </div>

          <h2
            className="font-playfair text-2xl sm:text-3xl font-bold mb-6 text-center"
            style={{ color: "var(--text-primary)" }}
          >
            How AI Analyzes Mushroom Features?
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-8 text-center max-w-3xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            This process works similarly to how experienced field mycologists
            approach identification. Instead of looking at a single trait, the
            AI evaluates combinations of characteristics:
          </p>

          <div className="overflow-x-auto mb-12">
            <table
              className="w-full text-sm sm:text-base"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th
                    className="p-3 sm:p-4 text-left font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Feature
                  </th>
                  <th
                    className="p-3 sm:p-4 text-left font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Example Observation
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Cap shape",
                    observation: "Convex, flat, or bell-shaped",
                  },
                  {
                    feature: "Gill attachment",
                    observation: "Free gills, decurrent gills, attached gills",
                  },
                  {
                    feature: "Stem structure",
                    observation: "Hollow stem or solid stem",
                  },
                  {
                    feature: "Habitat",
                    observation: "Growing on wood, soil, moss, or leaf litter",
                  },
                  {
                    feature: "Tree association",
                    observation: "Oak, birch, beech, hemlock, conifer",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      className="p-3 sm:p-4 font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {row.feature}
                    </td>
                    <td
                      className="p-3 sm:p-4"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {row.observation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            className="text-base sm:text-lg leading-relaxed text-center"
            style={{ color: "var(--text-muted)" }}
          >
            These traits together help distinguish species that may appear
            almost identical at first glance.
          </p>
        </div>
      </section>

      <div className="px-6"><IdentifyBanner /></div>

      <section id="how-it-works" className="py-12 sm:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-playfair text-4xl md:text-5xl font-bold text-center mb-16"
            style={{ color: "var(--text-primary)" }}
          >
            How to Use the Mushroom Identifier?
          </h2>
          <p
            className="text-center text-lg mb-12 max-w-3xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Identifying a mushroom with an AI mushroom identifier only takes a
            minute if you capture the right details. The tool uses computer
            vision and fungal species databases to compare your photos with
            thousands of known mushroom and fungi specimens. Follow these quick
            steps to get the most accurate results.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                icon: Camera,
                title: "Upload Clear Mushroom Photos",
                desc: "Start by uploading clear, well-lit images of the mushroom. The AI analyzes visual traits such as cap color, texture, gill pattern, and stem structure.",
              },
              {
                num: "02",
                icon: Shield,
                title: "Capture Multiple Angles",
                desc: "Upload several angles of the specimen so the image recognition system can detect more identifying features. Recommended views: cap (top view), side profile, underside (gills, pores, or teeth).",
              },
              {
                num: "03",
                icon: Camera,
                title: "Photograph the Mushroom Cap",
                desc: "Take a top-down photo of the mushroom cap showing cap shape, color and patterns, and surface texture (smooth, scaly, warty). This helps narrow down potential fungal species.",
              },
              {
                num: "04",
                icon: Leaf,
                title: "Show the Underside Structure",
                desc: "Turn the mushroom over and photograph the gills, pores, or spines. These structures are often the most important diagnostic feature in mycology.",
              },
              {
                num: "05",
                icon: TreeDeciduous,
                title: "Capture the Stem and Base",
                desc: "Photograph the full stem and base before removing the mushroom from the ground. This may reveal important structures like ring, volva, or basal bulb.",
              },
              {
                num: "06",
                icon: TreeDeciduous,
                title: "Include the Habitat",
                desc: "Take a photo showing the mushroom in its natural habitat, including soil or moss, leaf litter, decaying wood or logs, and nearby trees (oak, birch, conifer).",
              },
              {
                num: "07",
                icon: Mountain,
                title: "Enter Location and Date Found",
                desc: "Provide the geographic location and date when the mushroom was found. This helps the system filter species by geographic range, seasonality, and climate and elevation.",
              },
              {
                num: "08",
                icon: BookOpen,
                title: "Add Observational Notes",
                desc: "Include details the camera cannot capture, such as odor or smell, bruising reactions, spore print color, and cap texture (slimy, dry, velvety).",
              },
              {
                num: "09",
                icon: Microscope,
                title: "Run the AI Identification",
                desc: "Click Identify Mushroom and the AI will analyze the uploaded images using machine learning and visual feature extraction. The system returns a ranked list of possible mushroom species.",
              },
              {
                num: "10",
                icon: CheckCircle,
                title: "Review Results Carefully",
                desc: "Treat the results as a starting point for research, not a final answer. Many mushrooms have dangerous look-alikes, including toxic species like Amanita phalloides (death cap). Never eat a wild mushroom based only on an AI mushroom identification result.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="relative text-center p-6 rounded-xl card-lift card-glow"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl font-playfair font-bold"
                  style={{ color: "var(--accent)", opacity: 0.1 }}
                >
                  {step.num}
                </div>
                <step.icon
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: "var(--accent)" }}
                />
                <h3
                  className="font-semibold text-xl mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual break — person foraging mushrooms */}
      <section className="py-4 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <NextImage
              src="/person-foraging-mushroom-nature.webp"
              alt="Mushroom identification app — forager holding freshly picked Cantharellus cibarius (golden chanterelles)"
              width={1200}
              height={500}
              loading="lazy"
              className="w-full h-auto"
              style={{ display: 'block', maxHeight: '420px', objectFit: 'cover' }}
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
              <p className="text-xs text-white/70 m-0">Photo by Gunnar Creutz · Wikimedia Commons · CC BY-SA 4.0</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Who This Mushroom Identifier Is For?
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-12 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            The mushroom identifier is designed for anyone curious about fungi
            in the wild. It can be especially helpful for:
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              "Hikers and outdoor explorers encountering mushrooms on trails",
              "Backyard nature observers discovering fungi in gardens or lawns",
              "Mushroom foragers researching species before consulting experts",
              "Students studying mycology or forest ecology",
              "Nature photographers documenting fungal diversity",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <CheckCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: "var(--accent)" }}
                />
                <p style={{ color: "var(--text-primary)" }}>{item}</p>
              </div>
            ))}
          </div>

          <p
            className="text-base sm:text-lg leading-relaxed mt-8 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Whether you are walking through a Pacific Northwest conifer forest,
            exploring a Rocky Mountain meadow, or simply observing mushrooms
            growing on a fallen hardwood log, the tool can provide a quick
            starting point for understanding what species you may be seeing.
          </p>
          <p
            className="text-base sm:text-lg leading-relaxed mt-4 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Want to sharpen your identification skills before heading into the
            field? Try our free{" "}
            <Link
              href="/mushroom-identification-quiz"
              style={{ color: "var(--accent)", textDecoration: "underline" }}
            >
              mushroom identification quiz
            </Link>{" "}
            — 50 expert questions covering toxic species, edible fungi, and
            anatomy terms with a 30-second timer per question.
          </p>
        </div>
      </section>

      <div className="px-6"><IdentifyBanner /></div>

      <section className="py-10 sm:py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            How AI Helps Identify Mushrooms?
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Artificial intelligence enables rapid mushroom recognition by
            combining several technologies:
          </p>
          <ul className="space-y-3 mb-8">
            {[
              "Computer vision to detect patterns in images",
              "Machine learning models trained on fungal specimen photos",
              "Feature extraction algorithms identifying structural traits",
              "Species probability ranking based on visual similarity and context",
            ].map((tech, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <CheckCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: "var(--accent)" }}
                />
                <p style={{ color: "var(--text-primary)" }}>{tech}</p>
              </li>
            ))}
          </ul>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Instead of relying solely on color, the AI evaluates multiple
            anatomical features simultaneously: cap color and surface texture,
            gill or pore structure, stem thickness and internal structure,
            presence of a ring, veil, or volva, growth pattern and clustering,
            and habitat and substrate information. This approach helps
            distinguish closely related fungi and identify potential look-alike
            species, which are common in the fungal world.
          </p>
        </div>
      </section>

      {/* Visual break — mushroom gills close-up */}
      <section className="py-4 px-6" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <NextImage
              src="/mushroom-gills-closeup-macro.webp"
              alt="Mushroom identification app — macro close-up of Cortinarius violaceus gills showing radial lamellae structure"
              width={1200}
              height={500}
              loading="lazy"
              className="w-full h-auto"
              style={{ display: 'block', maxHeight: '380px', objectFit: 'cover' }}
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
              <p className="text-xs text-white/70 m-0">Photo by 00Amanita00 · Wikimedia Commons · CC BY-SA 3.0</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Why Mushroom Identification Requires Caution?
          </h2>
          <p
            className="text-base sm:text-lg leading-relaxed mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Identifying mushrooms is complex because many species share similar
            visual traits. Some of the most dangerous fungi — including members
            of the Amanita genus — resemble edible mushrooms commonly collected
            by beginners.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div
              className="p-6 rounded-xl"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <h3 className="font-semibold mb-2 text-red-500">
                <Link href="/amanita-phalloides-death-cap" className="hover:underline">Amanita phalloides (death cap)</Link>
              </h3>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                Responsible for many fatal mushroom poisonings worldwide
              </p>
            </div>
            <div
              className="p-6 rounded-xl"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <h3 className="font-semibold mb-2 text-red-500">
                Amanita bisporigera (destroying angel)
              </h3>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                Visually similar to edible button mushrooms when young
              </p>
            </div>
          </div>
          <p
            className="text-base sm:text-lg leading-relaxed mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Other highly dangerous species include{" "}
            <Link href="/amanita-virosa-mushroom" style={{ color: "var(--accent)" }} className="hover:underline">Amanita virosa (destroying angel)</Link>,{" "}
            <Link href="/amanita-ocreata" style={{ color: "var(--accent)" }} className="hover:underline">Amanita ocreata (western destroying angel)</Link>,{" "}
            <Link href="/cortinarius-rubellus" style={{ color: "var(--accent)" }} className="hover:underline">Cortinarius rubellus (deadly webcap)</Link>,{" "}
            <Link href="/galerina-marginata" style={{ color: "var(--accent)" }} className="hover:underline">Galerina marginata (funeral bell)</Link>, and{" "}
            <Link href="/lepiota-brunneoincarnata" style={{ color: "var(--accent)" }} className="hover:underline">Lepiota brunneoincarnata (deadly dapperling)</Link>.
            Toxic mushrooms in the Amanita genus, such as{" "}
            <Link href="/amanita-muscaria" style={{ color: "var(--accent)" }} className="hover:underline">Amanita muscaria (fly agaric)</Link> and{" "}
            <Link href="/amanita-pantherina" style={{ color: "var(--accent)" }} className="hover:underline">Amanita pantherina (panther cap)</Link>, can also cause severe poisoning.
          </p>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Even experienced mycologists often rely on additional diagnostic
            signals such as spore print color, bruising reactions, smell or
            odor, and microscopic examination. Because a photo cannot capture
            all of these details, a mushroom identifier should always be treated
            as a starting point for research, not a final answer.
          </p>
        </div>
      </section>

      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            When You Should Not Rely Only on a Mushroom Identifier?
          </h2>

          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed mb-12"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              An AI mushroom identifier is an excellent starting point for
              recognizing fungi, but it should never be the only source used to
              make important decisions about wild mushrooms. Even the most
              advanced computer vision and machine learning systems cannot
              replace the experience of a trained mycologist or the careful
              verification methods used in traditional mycology.
            </p>
            <p>
              Certain situations require additional caution because visual
              similarity between mushroom species is extremely common. Many
              edible mushrooms have dangerous look-alikes that share similar cap
              color, gill structure, or stem appearance.
            </p>
          </div>

          <div className="mb-12">
            <h3
              className="font-semibold text-xl mb-6 text-center"
              style={{ color: "var(--text-primary)" }}
            >
              You should avoid relying only on a mushroom identifier in the
              following situations:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "When deciding whether a wild mushroom is edible",
                "When a mushroom is suspected to be toxic or poisonous",
                "When children or pets may have touched or ingested a mushroom",
                "When identifying mushrooms belonging to high-risk genera such as Amanita",
                "When the mushroom's base, spore print, or bruising reaction cannot be observed",
                "When the mushroom grows in unusual habitats or rare environments",
              ].map((situation, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                  <p style={{ color: "var(--text-primary)" }}>{situation}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-6 sm:p-8 rounded-xl text-center"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "2px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <p
              className="text-base sm:text-lg leading-relaxed font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              In these cases, the safest approach is to consult a local
              mycologist, regional mycological society, or poison control
              center. AI tools are powerful for research and learning, but they
              should always be used as supporting tools rather than final
              authorities.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Best Practices for Safer Mushroom Identification
          </h2>

          <p
            className="text-center text-lg mb-12 max-w-3xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Successful mushroom identification relies on careful observation,
            accurate documentation, and verification from multiple sources.
            Combining AI image recognition with traditional field identification
            techniques provides the most reliable results.
          </p>

          <div
            className="mb-12 p-6 sm:p-8 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="font-playfair text-2xl font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Key Practices Used by Mycologists
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              Professional mushroom experts follow a consistent process when
              identifying fungi in nature. These steps can help improve both AI
              identification accuracy and human verification.
            </p>

            <div className="space-y-8">
              <div>
                <h4
                  className="font-semibold text-lg mb-3 flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                  Observe the specimen before touching it
                </h4>
                <ul
                  className="ml-7 space-y-2 text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  <li>• Look at the cap shape, color, and surface texture</li>
                  <li>
                    • Note whether the mushroom grows alone or in clusters
                  </li>
                  <li>
                    • Check if it is growing on soil, moss, wood, or leaf litter
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  className="font-semibold text-lg mb-3 flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                  Photograph the mushroom in its habitat
                </h4>
                <p
                  className="ml-7 mb-2 text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  Capture images showing the environment such as:
                </p>
                <ul
                  className="ml-7 space-y-2 text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  <li>• Decaying hardwood logs</li>
                  <li>• Conifer forest floors</li>
                  <li>• Fallen branches or buried roots</li>
                  <li>• Open meadows or woodland edges</li>
                </ul>
              </div>

              <div>
                <h4
                  className="font-semibold text-lg mb-3 flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                  Document structural traits
                </h4>
                <p
                  className="ml-7 mb-2 text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  Important mushroom anatomy features include:
                </p>
                <ul
                  className="ml-7 space-y-2 text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  <li>
                    • <strong>Cap</strong> – color, shape, scales, or warts
                  </li>
                  <li>
                    • <strong>Gills or pores</strong> – spacing and attachment
                    to the stem
                  </li>
                  <li>
                    • <strong>Stem</strong> – thickness, texture, hollow or
                    solid interior
                  </li>
                  <li>
                    • <strong>Ring or veil</strong> – protective structures
                    beneath the cap
                  </li>
                  <li>
                    • <strong>Volva or basal bulb</strong> – structures found at
                    the base of certain species
                  </li>
                </ul>
              </div>

              <div>
                <h4
                  className="font-semibold text-lg mb-3 flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: "var(--accent)" }}
                  />
                  Record environmental context
                </h4>
                <p
                  className="ml-7 mb-2 text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  Write down:
                </p>
                <ul
                  className="ml-7 space-y-2 text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  <li>• Location and geographic region</li>
                  <li>
                    • Nearby tree species such as oak, birch, beech, or hemlock
                  </li>
                  <li>• Substrate (soil, wood, moss, dung)</li>
                  <li>• Elevation and climate conditions</li>
                </ul>
              </div>
            </div>

            <div
              className="mt-8 p-4 rounded-lg"
              style={{
                background: "var(--accent-bg)",
                border: "1px solid var(--accent)",
              }}
            >
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                These ecological clues help narrow the list of possible fungal
                species.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual break — mushroom cluster on wood */}
      <section className="py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <NextImage
              src="/mushroom-cluster-growing-on-wood.webp"
              alt="Mushroom identification app — Pleurotus ostreatus (oyster mushroom) cluster growing on fallen wood"
              width={1200}
              height={500}
              loading="lazy"
              className="w-full h-auto"
              style={{ display: 'block', maxHeight: '400px', objectFit: 'cover' }}
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
              <p className="text-xs text-white/70 m-0">Photo by Rosser1954 · Wikimedia Commons · Public Domain</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Mushroom Identification in Different Habitats
          </h2>
          <p
            className="text-center text-lg mb-12 max-w-3xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Habitat is one of the most important clues in accurate mushroom
            identification, and it plays a critical role in how a mushroom
            identifier app or mushroom identifier AI delivers results. Most
            fungi grow in very specific environments and form relationships with
            certain trees, soil types, grasslands, or decaying wood. When you
            use a mushroom identifier by photo or mushroom identifier online,
            including the surrounding habitat in your images can significantly
            improve identification accuracy and help the system detect whether a
            species may be harmful or safe.
          </p>
          <p
            className="text-center text-lg mb-12 max-w-3xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Our free mushroom identifier app is designed to go beyond just
            visual recognition—it also considers environmental context. For
            example, some mushrooms only grow under oak or pine trees, while
            others appear exclusively on rotting logs or moist forest floors. By
            capturing habitat details along with the mushroom itself, the app
            can better match patterns, suggest similar species, and provide more
            reliable toxicity warnings. This makes habitat awareness a powerful
            factor when using any mushroom identifier free tool for real-world
            identification.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Mushrooms Growing on Soil",
                desc: "Many mushrooms appear directly from the forest soil, especially in woodland environments. These species are often mycorrhizal fungi, meaning they form beneficial underground partnerships with tree roots. Often found near oak, beech, birch, or conifer trees.",
              },
              {
                title: "Mushrooms Growing on Moss",
                desc: "Some fungi prefer moist moss-covered environments. Moss retains water and organic matter, creating ideal conditions for many small woodland mushrooms. Found in damp forest floors, often appear after rain or high humidity.",
              },
              {
                title: "Mushrooms Growing on Hardwood Logs",
                desc: "Many fungi specialize in breaking down decaying hardwood, such as oak, maple, or birch logs. These mushrooms are known as wood-rotting fungi. They play a vital ecological role by recycling nutrients back into the forest ecosystem.",
              },
              {
                title: "Mushrooms Growing on Conifer Wood",
                desc: "Some fungi grow specifically on conifer trees such as pine, spruce, or fir. Conifer wood contains different chemical compounds than hardwood, so certain fungi specialize in breaking it down.",
              },
              {
                title: "Mushrooms Growing on Living Trees",
                desc: "Some mushrooms grow directly on living trees, especially on damaged or weakened areas of bark. These fungi may act as parasites or decomposers. Common signs include mushrooms emerging from tree trunks or branches and shelf-like formations.",
              },
              {
                title: "Mushrooms in Meadows and Grassy Areas",
                desc: "Not all mushrooms grow in forests. Many species appear in open meadows, lawns, and grassy fields, where they feed on organic material in soil. These environments are sometimes associated with fairy rings.",
              },
            ].map((habitat, i) => (
              <div
                key={i}
                className="p-6 rounded-xl card-lift"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3
                  className="font-semibold text-lg mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {habitat.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {habitat.desc}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-center text-base sm:text-lg leading-relaxed mt-8 max-w-3xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            In lawns and grassy areas, common species include{" "}
            <Link href="/chlorophyllum-molybdites" style={{ color: "var(--accent)" }} className="hover:underline">Chlorophyllum molybdites</Link>, one of the most frequently misidentified poisonous mushrooms in North America, and the edible{" "}
            <Link href="/agaricus-campestris" style={{ color: "var(--accent)" }} className="hover:underline">Agaricus campestris (field mushroom)</Link>.
            If you find unexpected fungi in your yard, our guide explains{" "}
            <Link href="/why-are-mushrooms-growing-in-my-yard" style={{ color: "var(--accent)" }} className="hover:underline">why mushrooms grow in your yard</Link> and how to identify them safely.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Can This Tool Identify Mushrooms Growing on Wood?
          </h2>

          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed mb-12"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              Yes. Many distinctive fungi grow on logs, tree trunks, and woody
              debris, and the mushroom identifier can often recognize these
              species when clear images are provided. Wood-growing species like{" "}
              <Link href="/hypholoma-fasciculare" style={{ color: "var(--accent)" }} className="hover:underline">Hypholoma fasciculare (sulfur tuft)</Link> form dense clusters on stumps, while{" "}
              <Link href="/pleurotus-ostreatus" style={{ color: "var(--accent)" }} className="hover:underline">oyster mushrooms</Link> colonize hardwood logs.
            </p>
            <p>
              However, the AI needs to see how the mushroom attaches to the
              wood.
            </p>
          </div>

          <div
            className="p-6 sm:p-8 rounded-xl mb-8"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="font-semibold text-xl mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Helpful photo details include:
            </h3>
            <div className="space-y-3">
              {[
                "Whether the mushroom has a stem",
                "Whether it forms shelf-like brackets",
                "Whether it grows in dense clusters",
              ].map((detail, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "var(--accent)" }}
                  />
                  <p
                    className="text-base"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              It is also helpful to mention whether the wood appears to be
              hardwood or conifer, since some fungi specialize in only one type.
            </p>
            <p>
              Including this context helps the system better match the specimen
              with the correct fungal species database entries.
            </p>
          </div>
        </div>
      </section>

      <div className="px-6"><IdentifyBanner /></div>

      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Mushroom Identification Accuracy: What Affects It Most
          </h2>

          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed mb-12"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              The accuracy of an AI mushroom identifier depends on several
              factors. While artificial intelligence can analyze visual patterns
              extremely quickly, the quality of input information plays a major
              role.
            </p>
          </div>

          <h3
            className="font-playfair text-2xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Factors That Improve Identification Accuracy
          </h3>

          <div className="overflow-x-auto mb-12">
            <table
              className="w-full text-sm sm:text-base"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th
                    className="p-3 sm:p-4 text-left font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Factor
                  </th>
                  <th
                    className="p-3 sm:p-4 text-left font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Why It Matters
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    factor: "Multiple photo angles",
                    why: "Reveals different anatomical features",
                  },
                  {
                    factor: "Clear lighting",
                    why: "Shows color and surface texture accurately",
                  },
                  {
                    factor: "Habitat photos",
                    why: "Provides ecological context",
                  },
                  {
                    factor: "Geographic location",
                    why: "Filters species by regional distribution",
                  },
                  {
                    factor: "Date found",
                    why: "Accounts for mushroom seasonality",
                  },
                  {
                    factor: "Distinctive species traits",
                    why: "Reduces confusion with look-alikes",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      className="p-3 sm:p-4 font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {row.factor}
                    </td>
                    <td
                      className="p-3 sm:p-4"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {row.why}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              Species that are visually unique are usually identified with
              higher confidence, while mushrooms with many similar relatives can
              produce multiple possible matches.
            </p>
            <p>
              For example, white mushrooms with free gills and a ring on the
              stem may belong to several genera, including both edible and toxic
              species.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Mushroom Identification for Beginners
          </h2>

          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed mb-12"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              Learning to identify mushrooms is an exciting process, but
              beginners should approach it carefully. Many field guides
              emphasize the importance of observing structural traits, habitat
              relationships, and ecological patterns rather than relying on a
              single visual feature.
            </p>
          </div>

          <div
            className="p-6 sm:p-8 rounded-xl mb-12"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="font-playfair text-2xl font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Simple Traits to Observe First
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              Start by focusing on a few basic characteristics:
            </p>
            <div className="space-y-3">
              {[
                "Cap shape and color",
                "Presence of gills, pores, or spines",
                "Stem thickness and structure",
                "Whether the mushroom grows on wood or soil",
                "Nearby tree species",
              ].map((trait, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "var(--accent)" }}
                  />
                  <p
                    className="text-base"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {trait}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="text-base leading-relaxed mt-6"
              style={{ color: "var(--text-muted)" }}
            >
              Even simple observations can dramatically reduce the number of
              potential species.
            </p>
          </div>

          <div
            className="p-6 sm:p-8 rounded-xl mb-8"
            style={{
              background: "rgba(251, 146, 60, 0.1)",
              border: "2px solid rgba(251, 146, 60, 0.3)",
            }}
          >
            <h3 className="font-semibold text-xl mb-6 text-amber-500">
              Common Beginner Mistakes
            </h3>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Many misidentifications occur because important details are
              overlooked.
            </p>
            <p
              className="text-base leading-relaxed mb-4 font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Avoid these common errors:
            </p>
            <div className="space-y-3">
              {[
                "Taking only one photo of the cap",
                "Ignoring the stem base or volva",
                "Forgetting to note the habitat",
                "Assuming a mushroom is edible because it resembles a familiar species",
              ].map((mistake, i) => (
                <div key={i} className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                  <p
                    className="text-base"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {mistake}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="text-base sm:text-lg leading-relaxed text-center"
            style={{ color: "var(--text-muted)" }}
          >
            <p className="mb-4">
              For example, the edible{" "}
              <Link href="/agaricus-arvensis-horse-mushroom" style={{ color: "var(--accent)" }} className="hover:underline">Agaricus arvensis (horse mushroom)</Link>{" "}
              can be confused with the toxic{" "}
              <Link href="/agaricus-xanthodermus" style={{ color: "var(--accent)" }} className="hover:underline">Agaricus xanthodermus (yellow stainer)</Link>, which causes gastrointestinal distress.
            </p>
            <p>
              Remember that even experienced foragers often verify their
              findings with multiple references or expert advice.
            </p>
          </div>
        </div>
      </section>

      {/* Visual break — colorful mushrooms */}
      <section className="py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <NextImage
              src="/colorful-wild-mushrooms-nature.webp"
              alt="Mushroom identification app — group of Amanita muscaria (fly agaric) mushrooms in autumn woodland"
              width={1200}
              height={500}
              loading="lazy"
              className="w-full h-auto"
              style={{ display: 'block', maxHeight: '420px', objectFit: 'cover' }}
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
              <p className="text-xs text-white/70 m-0">Photo by Onderwijsgek · Wikimedia Commons · CC BY-SA 3.0 NL</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Why This Mushroom Identifier Is Useful as a Web-Based Tool?
          </h2>

          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed mb-12"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              One advantage of a web-based mushroom identifier is accessibility.
              Unlike many mobile apps, the tool works directly in a browser on
              desktop, tablet, or smartphone.
            </p>
            <p>
              This makes it easy to use while hiking or exploring outdoor
              environments.
            </p>
          </div>

          <div
            className="p-6 sm:p-8 rounded-xl"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <h3
              className="font-semibold text-xl mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Key advantages include:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "No app download or installation required",
                "Works on mobile devices and computers",
                "Fast access in the field",
                "No account creation necessary",
                "Unlimited identification requests",
              ].map((advantage, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: "var(--accent)" }}
                  />
                  <p
                    className="text-base"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {advantage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-8 text-base sm:text-lg leading-relaxed text-center"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              Because it runs entirely online, users can identify multiple
              specimens during a single outing without needing to install
              updates or manage software.
            </p>
          </div>
        </div>
      </section>

      <div className="px-6"><IdentifyBanner /></div>

      <section className="py-10 sm:py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Mushroom ID Chart: Common Types
          </h2>
          <p
            className="text-center text-lg mb-12"
            style={{ color: "var(--text-muted)" }}
          >
            A mushroom ID chart is a helpful visual reference used in mushroom
            identification and mycology. It groups mushrooms by their key
            structural traits so beginners can quickly narrow down possible
            species.
          </p>

          <div className="overflow-x-auto mb-8">
            <table
              className="w-full text-sm"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th
                    className="p-3 text-left font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Mushroom Type
                  </th>
                  <th
                    className="p-3 text-left font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Key Features
                  </th>
                  <th
                    className="p-3 text-left font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Habitat
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: "Gilled Mushrooms",
                    features:
                      "Thin blade-like gills under the cap, visible stem",
                    habitat: "Forest soil, grasslands",
                  },
                  {
                    type: "Pore Mushrooms (Boletes)",
                    features: "Sponge-like underside with pores, thick caps",
                    habitat: "Near hardwood or conifer trees",
                  },
                  {
                    type: "Tooth / Spine Mushrooms",
                    features: "Underside covered with soft spines or teeth",
                    habitat: "Forest floors, moss, decaying wood",
                  },
                  {
                    type: "Polypores / Shelf Fungi",
                    features: "Bracket or shelf-shaped, no traditional stem",
                    habitat: "Dead logs, tree trunks",
                  },
                  {
                    type: "Puffballs",
                    features:
                      "Round, no visible gills, release spores as powder",
                    habitat: "Grasslands, fields, forest edges",
                  },
                  {
                    type: "Morels",
                    features: "Honeycomb-pattern caps with hollow interior",
                    habitat: "Forest soil near trees",
                  },
                  {
                    type: "Amanita Group",
                    features: "Often have gills, a ring, and a volva at base",
                    habitat: "Forests with oak, birch, or conifer",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      className="p-3 font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {row.type}
                    </td>
                    <td className="p-3" style={{ color: "var(--text-muted)" }}>
                      {row.features}
                    </td>
                    <td className="p-3" style={{ color: "var(--text-muted)" }}>
                      {row.habitat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            className="text-base sm:text-lg leading-relaxed mt-6 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            When identifying boletes, note that most are safe but some can cause illness. Learn whether{" "}
            <Link href="/are-there-any-deadly-leccinum-mushrooms" style={{ color: "var(--accent)" }} className="hover:underline">any Leccinum mushrooms are deadly</Link> and how to distinguish edible species like{" "}
            <Link href="/boletus-edulis" style={{ color: "var(--accent)" }} className="hover:underline">Boletus edulis (king bolete)</Link> from bitter lookalikes.
          </p>
        </div>
      </section>

      {/* Visual break — wild mushroom basket */}
      <section className="py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <NextImage
              src="/wild-mushroom-basket-foraging.webp"
              alt="Mushroom identification app — basket of freshly foraged Boletus edulis (king boletes / porcini) and related edible species"
              width={1200}
              height={500}
              loading="lazy"
              className="w-full h-auto"
              style={{ display: 'block', maxHeight: '400px', objectFit: 'cover' }}
            />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
              <p className="text-xs text-white/70 m-0">Photo by George Chernilevsky · Wikimedia Commons · Public Domain</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-12"
            style={{ color: "var(--text-primary)" }}
          >
            Key Benefits of Using This Free Mushroom Identifier
          </h2>

          <div className="space-y-8">
            {[
              {
                title: "Free Access with No Hidden Fees",
                desc: "This mushroom identification tool is completely free to use. There are no subscription plans, locked features, or hidden charges. Anyone interested in fungi identification, mushroom foraging, or nature observation can access the tool instantly through a web browser.",
              },
              {
                title: "Unlimited Mushroom Identifications",
                desc: "Users can run as many identification requests as they need. Each photo submission is analyzed independently by the AI recognition system, allowing you to identify multiple specimens during a single outing.",
              },
              {
                title: "Simple and Easy Photo Upload Workflow",
                desc: "The tool is designed with a straightforward interface that allows users to upload images quickly. The image analysis system works best when photos show important mushroom structures such as cap shape, gills, stem, and habitat.",
              },
              {
                title: "Fast Ranked Species Results",
                desc: "Once images are uploaded, the AI analyzes visual patterns and compares them with thousands of labeled fungal specimen images. The system returns a ranked list of possible mushroom species within seconds.",
              },
              {
                title: "Helpful for Learning Mushroom Traits",
                desc: "Using a mushroom identifier is also a great way to learn about mushroom anatomy and fungal biology. As users explore different species, they become familiar with important identification traits.",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-xl"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3
                  className="font-semibold text-xl mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-12"
            style={{ color: "var(--text-primary)" }}
          >
            When to Consult a Local Expert?
          </h2>

          <div
            className="space-y-6 text-base sm:text-lg leading-relaxed mb-12"
            style={{ color: "var(--text-muted)" }}
          >
            <p>
              There are times when expert assistance is essential. If a mushroom
              may pose a health risk, a trained professional should always
              confirm identification.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col justify-center gap-4"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-bg) 0%, var(--bg-card) 100%)",
                border: "1px solid var(--border)",
              }}
            >
              {[
                {
                  emoji: "🔬",
                  title: "When the species is unknown",
                  desc: "Never guess with an unfamiliar find",
                },
                {
                  emoji: "⚠️",
                  title: "When toxicity is suspected",
                  desc: "Seek immediate medical help if ingested",
                },
                {
                  emoji: "🌿",
                  title: "Before your first forage",
                  desc: "Go with an experienced guide first",
                },
                {
                  emoji: "📍",
                  title: "For local regional species",
                  desc: "Regional experts know local variations",
                },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {title}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="p-6 sm:p-8 rounded-xl flex flex-col justify-center"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <h3
                className="font-semibold text-xl mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                Experts who can help include:
              </h3>
              <div className="space-y-4">
                {[
                  "Professional mycologists",
                  "Members of a regional mycological society",
                  "Local mushroom identification groups",
                  "Poison control specialists",
                ].map((expert, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--accent)" }}
                    />
                    <p
                      className="text-base"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {expert}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Common Similar Species Our Mushroom Identifier Distinguishes
          </h2>
          <p
            className="text-center text-base sm:text-lg leading-relaxed mb-12 max-w-4xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Understanding look-alike mushrooms is essential in mushroom
            identification and mycology. Many fungal species share similar cap
            color or shape, but differ in gill attachment, stem structure,
            habitat, smell, and seasonality. Below are common confusing pairs
            explained clearly, along with how our AI mushroom identifier helps
            distinguish them.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div
              className="p-6 sm:p-8 rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-full mb-5 rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <NextImage
                  src="/death-cap-vs-paddy-straw-mushroom.webp"
                  alt="Death Cap vs Paddy Straw Mushroom comparison"
                  width={800}
                  height={320}
                  loading="lazy"
                  className="w-full h-auto"
                  style={{
                    display: "block",
                    maxHeight: "320px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h3
                className="font-playfair text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                1. Death Cap vs Paddy Straw Mushroom
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                (Amanita phalloides vs Volvariella volvacea)
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                The death cap is one of the most toxic mushrooms, often confused
                with the edible paddy straw mushroom due to similar appearance
                when young. The key difference lies in the presence of a ring
                and volva, along with habitat — forest vs cultivated
                environments.
              </p>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Feature
                      </th>
                      <th className="p-2 text-left font-semibold text-red-500">
                        Death Cap (Toxic)
                      </th>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        Paddy Straw (Edible)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Key Features",
                        toxic: "Volva, ring, free gills",
                        edible: "Volva, no ring",
                      },
                      {
                        feature: "Color",
                        toxic: "Greenish, pale yellow",
                        edible: "Gray to brown",
                      },
                      {
                        feature: "Smell",
                        toxic: "Mild sweet",
                        edible: "Mild earthy",
                      },
                      {
                        feature: "Growth Pattern",
                        toxic: "Single/scattered",
                        edible: "Clusters",
                      },
                      {
                        feature: "Environment",
                        toxic: "Woodland forests",
                        edible: "Straw, farms",
                      },
                      {
                        feature: "Habitat & Distribution",
                        toxic: "Europe, Asia, North America",
                        edible: "Tropical regions",
                      },
                      {
                        feature: "Seasonality",
                        toxic: "Summer–Fall",
                        edible: "Warm seasons",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          className="p-2 font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.toxic}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.edible}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid var(--accent)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  Our AI identifies differences in volva structure, ring
                  presence, habitat context, and cap color variation to prevent
                  confusion.
                </p>
              </div>
            </div>

            <div
              className="p-6 sm:p-8 rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-full mb-5 rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <NextImage
                  src="/destroying-angel-vs-button-mushroom.webp"
                  alt="Destroying Angel vs Button Mushroom comparison"
                  width={800}
                  height={320}
                  loading="lazy"
                  className="w-full h-auto"
                  style={{
                    display: "block",
                    maxHeight: "320px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h3
                className="font-playfair text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                2. Destroying Angel vs Button Mushroom
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                (Amanita bisporigera vs Agaricus bisporus)
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                The destroying angel looks very similar to edible button
                mushrooms, especially when young. However, it contains deadly
                toxins. The most reliable differences include gill color change
                and absence of volva in Agaricus.
              </p>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Feature
                      </th>
                      <th className="p-2 text-left font-semibold text-red-500">
                        Destroying Angel (Toxic)
                      </th>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        Button Mushroom (Edible)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Key Features",
                        toxic: "Volva + ring, white gills",
                        edible: "No volva, pink→brown gills",
                      },
                      {
                        feature: "Color",
                        toxic: "Pure white",
                        edible: "White/light brown",
                      },
                      {
                        feature: "Smell",
                        toxic: "Slight/unpleasant",
                        edible: "Mild pleasant",
                      },
                      {
                        feature: "Growth Pattern",
                        toxic: "Single",
                        edible: "Clusters",
                      },
                      {
                        feature: "Environment",
                        toxic: "Forest soil",
                        edible: "Grass/cultivated",
                      },
                      {
                        feature: "Habitat & Distribution",
                        toxic: "North America, Europe",
                        edible: "Worldwide",
                      },
                      {
                        feature: "Seasonality",
                        toxic: "Summer–Fall",
                        edible: "Year-round",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          className="p-2 font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.toxic}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.edible}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid var(--accent)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  Our AI detects gill color progression, stem base structure,
                  and habitat differences to distinguish these species.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div
              className="p-6 sm:p-8 rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-full mb-5 rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <NextImage
                  src="/chanterelle-vs-false-chanterelle.webp"
                  alt="Chanterelle vs False Chanterelle comparison"
                  width={800}
                  height={320}
                  loading="lazy"
                  className="w-full h-auto"
                  style={{
                    display: "block",
                    maxHeight: "320px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h3
                className="font-playfair text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                3. Chanterelle vs False Chanterelle
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                (<Link href="/cantharellus-cibarius" style={{ color: "var(--accent)" }} className="hover:underline">Cantharellus cibarius</Link> vs Hygrophoropsis aurantiaca)
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                True chanterelles are prized edible mushrooms but are often
                confused with false chanterelles. The key difference lies in
                ridge-like folds vs true gills, along with smell and growth
                environment.
              </p>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Feature
                      </th>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        Chanterelle (Edible)
                      </th>
                      <th className="p-2 text-left font-semibold text-amber-500">
                        False Chanterelle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Key Features",
                        edible: "Ridges (not true gills)",
                        false: "Thin true gills",
                      },
                      {
                        feature: "Color",
                        edible: "Yellow/golden",
                        false: "Bright orange",
                      },
                      {
                        feature: "Smell",
                        edible: "Fruity (apricot)",
                        false: "Weak/none",
                      },
                      {
                        feature: "Growth Pattern",
                        edible: "Scattered",
                        false: "Dense clusters",
                      },
                      {
                        feature: "Environment",
                        edible: "Forest soil",
                        false: "Decaying wood",
                      },
                      {
                        feature: "Habitat & Distribution",
                        edible: "Europe, North America",
                        false: "Worldwide",
                      },
                      {
                        feature: "Seasonality",
                        edible: "Summer–Fall",
                        false: "Late summer–Fall",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          className="p-2 font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.edible}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.false}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid var(--accent)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  Our AI identifies ridge vs gill structures, color intensity,
                  and substrate (soil vs wood) for accurate differentiation.
                </p>
              </div>
              <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
                Another dangerous chanterelle look-alike is{" "}
                <Link href="/omphalotus-illudens" style={{ color: "var(--accent)" }} className="hover:underline">Omphalotus illudens (Jack O&apos;Lantern)</Link>, which grows in clusters on wood and has true gills instead of ridges.
              </p>
            </div>

            <div
              className="p-6 sm:p-8 rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-full mb-5 rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <NextImage
                  src="/oyster-mushroom-vs-angel-wings.webp"
                  alt="Oyster Mushroom vs Angel Wings comparison"
                  width={800}
                  height={320}
                  loading="lazy"
                  className="w-full h-auto"
                  style={{
                    display: "block",
                    maxHeight: "320px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h3
                className="font-playfair text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                4. Oyster Mushroom vs Angel Wings
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                (<Link href="/pleurotus-ostreatus" style={{ color: "var(--accent)" }} className="hover:underline">Pleurotus ostreatus</Link> vs Pleurocybella porrigens)
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                Both species grow in clusters on wood, making them visually
                similar. However, oyster mushrooms are edible, while angel wings
                can be toxic in some conditions. The main differences include
                thickness and substrate type.
              </p>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Feature
                      </th>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        Oyster (Edible)
                      </th>
                      <th className="p-2 text-left font-semibold text-red-500">
                        Angel Wings (Toxic risk)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Key Features",
                        edible: "Thick flesh, decurrent gills",
                        toxic: "Thin, fragile",
                      },
                      {
                        feature: "Color",
                        edible: "Gray/white",
                        toxic: "Pure white",
                      },
                      {
                        feature: "Smell",
                        edible: "Mild pleasant",
                        toxic: "Slight",
                      },
                      {
                        feature: "Growth Pattern",
                        edible: "Clusters",
                        toxic: "Dense clusters",
                      },
                      {
                        feature: "Environment",
                        edible: "Hardwood logs",
                        toxic: "Conifer wood",
                      },
                      {
                        feature: "Habitat & Distribution",
                        edible: "Worldwide",
                        toxic: "Northern forests",
                      },
                      {
                        feature: "Seasonality",
                        edible: "Fall–Winter",
                        toxic: "Late fall",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          className="p-2 font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.edible}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.toxic}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid var(--accent)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  Our AI compares growth on hardwood vs conifer, gill
                  attachment, and body thickness to separate these species.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div
              className="p-6 sm:p-8 rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-full mb-5 rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <NextImage
                  src="/morel-vs-false-morel.webp"
                  alt="Morel vs False Morel comparison"
                  width={800}
                  height={320}
                  loading="lazy"
                  className="w-full h-auto"
                  style={{
                    display: "block",
                    maxHeight: "320px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h3
                className="font-playfair text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                5. Morel vs False Morel
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                (<Link href="/morchella-esculenta" style={{ color: "var(--accent)" }} className="hover:underline">Morchella esculenta</Link> vs <Link href="/gyromitra-esculenta" style={{ color: "var(--accent)" }} className="hover:underline">Gyromitra esculenta</Link>)
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                Morels are highly valued edible mushrooms, but false morels can
                be toxic. The most important distinction is internal structure
                and cap shape.
              </p>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Feature
                      </th>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        Morel (Edible)
                      </th>
                      <th className="p-2 text-left font-semibold text-red-500">
                        False Morel (Toxic)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Key Features",
                        edible: "Hollow, honeycomb cap",
                        toxic: "Brain-like, solid",
                      },
                      {
                        feature: "Color",
                        edible: "Tan/yellow",
                        toxic: "Reddish brown",
                      },
                      {
                        feature: "Smell",
                        edible: "Mild earthy",
                        toxic: "Strong",
                      },
                      {
                        feature: "Growth Pattern",
                        edible: "Scattered",
                        toxic: "Scattered",
                      },
                      {
                        feature: "Environment",
                        edible: "Forest soil",
                        toxic: "Woodland floor",
                      },
                      {
                        feature: "Habitat & Distribution",
                        edible: "North America, Europe",
                        toxic: "Northern hemisphere",
                      },
                      {
                        feature: "Seasonality",
                        edible: "Spring",
                        toxic: "Spring",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          className="p-2 font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.edible}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.toxic}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid var(--accent)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  Our AI analyzes cap texture patterns, internal structure
                  clues, and shape consistency for identification.
                </p>
              </div>
            </div>

            <div
              className="p-6 sm:p-8 rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-full mb-5 rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <NextImage
                  src="/puffball-vs-young-amanita.webp"
                  alt="Puffball vs Young Amanita comparison"
                  width={800}
                  height={320}
                  loading="lazy"
                  className="w-full h-auto"
                  style={{
                    display: "block",
                    maxHeight: "320px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h3
                className="font-playfair text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                6. Puffball vs Young Amanita
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                (Lycoperdon spp. vs Amanita spp. immature)
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                Young Amanita mushrooms can resemble puffballs before their caps
                open. This is a critical distinction because Amanita species are
                often highly toxic.
              </p>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Feature
                      </th>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        Puffball (Edible young)
                      </th>
                      <th className="p-2 text-left font-semibold text-red-500">
                        Young Amanita (Toxic)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Key Features",
                        edible: "Solid white interior",
                        toxic: "Developing gills inside",
                      },
                      { feature: "Color", edible: "White", toxic: "White" },
                      { feature: "Smell", edible: "Mild", toxic: "Neutral" },
                      {
                        feature: "Growth Pattern",
                        edible: "Groups",
                        toxic: "Single",
                      },
                      {
                        feature: "Environment",
                        edible: "Grasslands/forests",
                        toxic: "Forest soil",
                      },
                      {
                        feature: "Habitat & Distribution",
                        edible: "Worldwide",
                        toxic: "Worldwide",
                      },
                      {
                        feature: "Seasonality",
                        edible: "Summer–Fall",
                        toxic: "Summer–Fall",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          className="p-2 font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.edible}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.toxic}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid var(--accent)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  Our AI evaluates internal structure (via context clues),
                  growth pattern, and base features to avoid misidentification.
                </p>
              </div>
              <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
                <Link href="/scleroderma-citrinum" style={{ color: "var(--accent)" }} className="hover:underline">Scleroderma citrinum (common earthball)</Link> is another round fungus sometimes confused with puffballs, but it has a tough, dark interior unlike true puffballs.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="p-6 sm:p-8 rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-full mb-5 rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <NextImage
                  src="/king-bolete-vs-bitter-bolete.webp"
                  alt="King Bolete vs Bitter Bolete comparison"
                  width={800}
                  height={320}
                  loading="lazy"
                  className="w-full h-auto"
                  style={{
                    display: "block",
                    maxHeight: "320px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h3
                className="font-playfair text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                7. King Bolete vs Bitter Bolete
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                (<Link href="/boletus-edulis" style={{ color: "var(--accent)" }} className="hover:underline">Boletus edulis</Link> vs Tylopilus felleus)
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                Both are pore mushrooms and look very similar, but the bitter
                bolete is inedible due to taste. Differences include pore color
                and stem features.
              </p>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Feature
                      </th>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        King Bolete (Edible)
                      </th>
                      <th className="p-2 text-left font-semibold text-amber-500">
                        Bitter Bolete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Key Features",
                        edible: "Thick stem, white pores",
                        bitter: "Pink pores, bitter",
                      },
                      {
                        feature: "Color",
                        edible: "Brown cap",
                        bitter: "Brown cap",
                      },
                      { feature: "Smell", edible: "Pleasant", bitter: "Mild" },
                      {
                        feature: "Growth Pattern",
                        edible: "Single/scattered",
                        bitter: "Single",
                      },
                      {
                        feature: "Environment",
                        edible: "Forest soil",
                        bitter: "Forests",
                      },
                      {
                        feature: "Habitat & Distribution",
                        edible: "Europe, North America",
                        bitter: "Worldwide",
                      },
                      {
                        feature: "Seasonality",
                        edible: "Summer–Fall",
                        bitter: "Summer–Fall",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          className="p-2 font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.edible}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.bitter}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid var(--accent)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  Our AI identifies pore color variations, stem patterns, and
                  subtle surface differences to distinguish these boletes.
                </p>
              </div>
            </div>

            <div
              className="p-6 sm:p-8 rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-full mb-5 rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <NextImage
                  src="/shaggy-ink-cap-vs-common-ink-cap.webp"
                  alt="Shaggy Ink Cap vs Common Ink Cap comparison"
                  width={800}
                  height={320}
                  loading="lazy"
                  className="w-full h-auto"
                  style={{
                    display: "block",
                    maxHeight: "320px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <h3
                className="font-playfair text-2xl font-bold mb-6"
                style={{ color: "var(--text-primary)" }}
              >
                8. Shaggy Ink Cap vs Common Ink Cap
              </h3>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                (Coprinus comatus vs Coprinopsis atramentaria)
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--text-muted)" }}
              >
                Both ink caps grow in urban and grassy areas, but they differ in
                cap texture and appearance.
              </p>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  style={{ borderCollapse: "collapse" }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Feature
                      </th>
                      <th
                        className="p-2 text-left font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        Shaggy Ink Cap (Edible young)
                      </th>
                      <th className="p-2 text-left font-semibold text-amber-500">
                        Common Ink Cap
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Key Features",
                        shaggy: "Shaggy, elongated cap",
                        common: "Smooth gray cap",
                      },
                      {
                        feature: "Color",
                        shaggy: "White with scales",
                        common: "Gray",
                      },
                      { feature: "Smell", shaggy: "Mild", common: "Mild" },
                      {
                        feature: "Growth Pattern",
                        shaggy: "Groups",
                        common: "Groups",
                      },
                      {
                        feature: "Environment",
                        shaggy: "Lawns/roadsides",
                        common: "Urban soil",
                      },
                      {
                        feature: "Habitat & Distribution",
                        shaggy: "Worldwide",
                        common: "Worldwide",
                      },
                      {
                        feature: "Seasonality",
                        shaggy: "Spring–Fall",
                        common: "Spring–Fall",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          className="p-2 font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.shaggy}
                        </td>
                        <td
                          className="p-2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.common}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid var(--accent)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  Our AI analyzes cap texture, shape, and growth environment to
                  clearly separate these similar species.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-10 sm:py-14 px-6"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-center mb-12"
            style={{ color: "var(--text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What type of mushroom is this?",
                a: "To determine what type of mushroom this is, observe key features such as cap shape, gills or pores, stem structure, and habitat. A mushroom identifier uses AI to analyze these traits and compare them with a database of fungal species.",
              },
              {
                q: "How does a mushroom identifier work?",
                a: "A mushroom identifier uses artificial intelligence and computer vision to analyze uploaded photos of a mushroom's cap, gills, pores, stem, and base. The system compares these visual features with thousands of labeled specimens and returns a ranked list of possible species matches.",
              },
              {
                q: "Is there a free mushroom identifier app?",
                a: "Yes, this tool works as a free web-based mushroom identifier that runs directly in your browser. Upload images and use AI mushroom recognition without installing software.",
              },
              {
                q: "Can a wild mushroom be identified from a picture?",
                a: "Yes, a wild mushroom identifier by picture can recognize many species by analyzing structural traits like cap texture, gill pattern, and habitat. However, photo-based identification should always be confirmed with a field guide or mycologist.",
              },
              {
                q: "Can a mushroom identifier tell if a mushroom is edible?",
                a: "No. A mushroom identifier tool can suggest possible species but cannot confirm edibility or toxicity. Some dangerous mushrooms like Amanita phalloides (death cap) closely resemble edible species.",
              },
              {
                q: "Why does habitat matter in mushroom identification?",
                a: "Many fungi grow in specific environments such as forest soil, moss, hardwood logs, or conifer wood. Habitat information helps narrow down possible mushroom species since many fungi form ecological relationships with certain trees or substrates.",
              },
              {
                q: "Do I need to create an account?",
                a: "No. The tool works instantly in your browser and does not require registration or sign-up.",
              },
              {
                q: "How does the AI identify mushrooms?",
                a: "The system uses machine learning and computer vision trained on large datasets of labeled fungal specimen images. It analyzes features such as cap shape, gill pattern, stem structure, and habitat clues.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-xl"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3
                  className="font-semibold text-lg mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {faq.q}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="p-8 sm:p-12 rounded-2xl text-center"
            style={{
              background: "var(--accent-bg)",
              border: "2px solid var(--accent)",
            }}
          >
            <h2
              className="font-playfair text-3xl sm:text-4xl font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Final Safety Reminder Before Using Any Mushroom Identification
              Result
            </h2>
            <div
              className="space-y-4 text-base sm:text-lg leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              <p>
                A mushroom identifier is a valuable educational tool, but it
                cannot replace professional expertise or traditional
                identification methods.
              </p>
              <div
                className="my-8 p-6 rounded-lg"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1 text-red-500" />
                    <span>
                      Never eat a wild mushroom based solely on AI
                      identification
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1 text-red-500" />
                    <span>
                      Keep unknown mushrooms away from children and pets
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1 text-red-500" />
                    <span>
                      Always verify results using field guides or expert advice
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1 text-red-500" />
                    <span>
                      Treat AI suggestions as hypotheses, not final answers
                    </span>
                  </li>
                </ul>
              </div>
              <p className="font-medium">
                Nature contains an incredible diversity of fungi, from tiny
                woodland species to large mushrooms growing on ancient logs.
                Using a mushroom identifier responsibly can help you explore
                this fascinating world while staying safe and informed.
              </p>
            </div>
          </div>
        </div>
      </section>
        </>
      )}
      {/* === END admin-editable homepage middle === */}

      {/* HomeReviews removed per product decision — reviews section no
          longer appears on homepage. Component file kept on disk in case
          we want to re-introduce it later. */}
    </div>
  );
}
