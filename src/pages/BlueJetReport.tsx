import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical, Pill, Candy, TrendingUp, Shield, Factory,
  ChevronDown, ChevronUp, Info, ArrowLeft, AlertTriangle,
  Beaker, Globe, Building2, DollarSign, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// ─── Know More content mapped from blog research ───

const KNOW_MORE_CONTENT: Record<string, { title: string; content: string }> = {
  sweetener_sensory: {
    title: "Why Taste Consistency Matters More Than Price",
    content: `Global FMCG companies such as Colgate and major beverage manufacturers are not simply buying a molecule. They are buying a precise sensory profile that must remain identical across years, geographies, and billions of units produced.

Even microscopic variations can alter how a product tastes, smells, or feels to consumers.

Blue Jet does not sell saccharin as a generic chemical. It supplies a highly controlled and consistent product defined by specific crystalline structure, precise particle size distribution, and controlled impurity profile. These parameters together create a predictable sensory fingerprint characterized by immediate sweetness onset, no bitter or metallic aftertaste, and stable interaction with flavor oils and other formulation ingredients.

This consistency is critical for maintaining brand integrity.`
  },
  sweetener_pharma_grade: {
    title: "Pharma-Grade Compliance as a Barrier",
    content: `Blue Jet is the only Indian manufacturer with a dedicated pharma-grade saccharin facility compliant with USP (United States Pharmacopeia) and BP (British Pharmacopeia) standards.

For applications such as oral care and pharmaceuticals, saccharin must meet strict GMP (Good Manufacturing Practice) and pharmacopeial standards. Most low-cost Chinese saccharin producers primarily supply food-grade material, which does not meet pharmaceutical or oral care regulatory requirements.

For regulated applications, compliance is not optional — it is mandatory.

Additionally, switching a saccharin supplier is not a simple procurement decision. It triggers a complex global validation process, including updating regulatory filings across more than 100 countries, reprinting packaging and ingredient declarations, revalidating manufacturing processes at every production facility globally, and conducting stability and sensory validation. The costs of switching often exceed the savings from marginally lower raw material prices.`
  },
  sweetener_china_dumping: {
    title: "The China Dumping Episode (FY24)",
    content: `In FY24, Chinese saccharin producers began dumping products at aggressively low, predatory prices. As a result, Blue Jet's sweetener segment revenue declined by approximately 30%.

However, Blue Jet primarily lost volumes in the spot market, which accounts for roughly 20–30% of the business. This segment is highly price-sensitive, where purchasing decisions are driven almost entirely by cost.

Crucially, Blue Jet retained its long-term contract volumes, which represent ~70% of the business, with major global FMCG customers. While Blue Jet lost opportunistic spot-market volumes due to temporary price dumping, its core contractual business remained intact.

Global FMCGs need a "China + 1" supplier to avoid risk, keeping Blue Jet relevant even if Chinese prices are lower.`
  },
  sweetener_new_molecule: {
    title: "New-Generation Sweetener Opportunity",
    content: `Blue Jet is currently working with a large global FMCG customer on a new-generation sweetener molecule (distinct from saccharin). Management commentary implies the long-term revenue potential could be significantly higher than its existing sweetener portfolio.

If the global market size is approximately $1 billion and Blue Jet achieves its stated objective of capturing a 10% market share, this translates into a potential annual revenue opportunity of around $100 million (₹895+ crore).

Although the company has not explicitly disclosed the molecule, available clues strongly suggest it is likely Sucralose — a next-generation high-intensity sweetener gradually replacing older molecules such as saccharin and aspartame. Sucralose typically sells at approximately $25–30 per kg, compared to saccharin at around $5–7 per kg — representing 4–5x higher realization.

Blue Jet would be the only source manufacturing it out of India.`
  },
  cm_oligopoly: {
    title: "Contrast Media: A Global Oligopoly",
    content: `The global contrast media market operates as an oligopoly, dominated by four major players — GE Healthcare, Bracco, Guerbet, and Bayer — which collectively control approximately 75% of global volumes. These companies manufacture and sell the finished contrast media products used in hospitals worldwide.

Rather than competing with these global giants in the finished product market, Blue Jet has strategically positioned itself deeper in the value chain. The company currently manufactures critical intermediates required to produce iodinated contrast agents. Today, Blue Jet supplies key intermediates to three of the top four global contrast media players, embedding itself within their supply chains and becoming an integral part of their manufacturing ecosystem.

The global contrast media formulations market (MAT June 2023) is valued at US$5.9 billion — 74% Iodinated (X-ray/CT), 24% Gadolinium (MRI), 2% Microbubble.`
  },
  cm_switching_costs: {
    title: "Why Blue Jet Isn't Easily Replaceable",
    content: `Customers can change suppliers, but Blue Jet's position in contrast media intermediates is reinforced by contractual visibility, long-standing customer relationships, and regulated change-control friction.

1) Contracted demand and long-term relationship: Blue Jet enters into annual and multi-year supply contracts (1 to 4 years), providing visibility and predictability of revenue and cash flows.

2) Regulatory switching friction: In regulated pharma manufacturing, changing intermediate suppliers requires customer qualification and regulatory change control, including stability and comparability data, which makes supplier transitions slow and operationally complex.

3) Process consistency and reliability advantage: Contrast media intermediates require strict impurity control and validated manufacturing processes. Even chemically equivalent alternatives must undergo customer qualification and regulatory validation, creating switching costs.

Once an intermediate supplier is approved for pharmaceutical use, switching requires regulatory revalidation, process redevelopment, stability testing, and customer and regulatory approvals — creating high switching costs and long replacement timelines.`
  },
  cm_value_chain: {
    title: "The Contrast Media Value Chain",
    content: `The manufacturing of contrast media intermediates is a multi-stage chemical transformation where each step significantly increases the value of the molecule:

Stage 1 — Starting Material (5-NIPA): Basic raw material, ~₹300 per kg. Commodity chemical with minimal differentiation.

Stage 2 — Advanced Intermediate (ABA HCl): Complex, multi-step chemical synthesis. Value increases to ~₹1,200 per kg (4× increase). Requires specialized process chemistry and regulatory compliance. Blue Jet has historically operated strongly in this segment.

Stage 3 — Iodinated Intermediate (Forward Integration): The most critical and value-intensive stage. Value increases to ~₹4,800 per kg (16× of starting material). Blue Jet has recently forayed into this stage by developing in-house processes and began supplying samples for customer validation in 2025.

Moving from Stage 1 to Stage 3 represents a 16× increase in value — Blue Jet is capturing more of this value chain.`
  },
  cm_iodine: {
    title: "Iodine: Strategic Raw Material Advantage",
    content: `Blue Jet has developed the capability to recover ~80-85% of iodine from waste streams, ensuring a structural cost advantage.

Iodine is strategically critical — expensive (₹5,000–6,000 per kg) and scarce, with global supply concentrated in Chile and Japan.

Blue Jet has built two enduring competitive advantages:

First, secure raw material access through long-term supply agreements with SQM (Chile), one of the world's largest iodine producers — ensuring supply stability and reducing exposure to raw material volatility.

Second, superior iodine recovery efficiency. In typical manufacturing, up to ~40% of iodine can be lost during reaction and processing stages. Through proprietary recovery systems, Blue Jet recovers approximately 80-85% of this otherwise lost iodine.

This translates to a roughly 40% cost saving on one of the most expensive raw materials in the process.`
  },
  cm_backward: {
    title: "Backward Integration: APD Manufacturing",
    content: `Blue Jet's primary raw material in the contrast media intermediate value chain is APD (Amino Phenol Derivative), with approximately 580 grams required to produce every kilogram of ABA HCl. Historically, APD accounted for over 50% of COGS, with the majority sourced from external suppliers in China and Norway.

To address this structural dependency, Blue Jet is backward integrating APD production at its Unit III facility in Mahad, with an installed capacity of 4,000 MTPA — sufficient to meet internal requirements while also providing optionality for external sales. The facility uses continuous flow synthesis, a first for Blue Jet.

This delivers: (1) Margin Protection — under supply agreements, only ~50% of raw material cost increases can be passed through. In-house APD protects margins from price spikes. (2) Supply Chain Security — significantly reduces dependence on Chinese suppliers, insulating from geopolitical risks and supply disruptions. (3) Reducing ~50% of COGS to an internal, controlled cost center.`
  },
  cm_gadopiclenol: {
    title: "The Gadopiclenol Opportunity",
    content: `During FY2025, Blue Jet commercialized a key intermediate for Gadopiclenol, a novel MRI contrast agent — signaling expansion beyond traditional iodinated contrast media into gadolinium-based products.

Gadopiclenol represents a qualitatively different opportunity:

• Patent Protection: Composition of matter patent expires August 2039, providing 14-year exclusivity from FDA approval (September 2022). Protects against generic competition and ensures pricing power.

• Clinical Differentiation: Requires 50% lower dose than standard macrocyclic agents (0.05 vs 0.1 mmol/kg). Attractive for CNS imaging, pediatric use, and repeat scans.

• Regulatory Lock-in: Blue Jet's BGB intermediate is specified in regulatory filings for both Guerbet (Elucirem) and Bracco (Vueway). Any supplier changes require customer requalification and regulatory change control.

• Market Access: Already approved in US and EU with international approvals expanding.`
  },
  pharma_statins: {
    title: "The Statin Intolerance Problem",
    content: `Statins such as Lipitor (Atorvastatin) are the most widely prescribed cholesterol-lowering drugs globally. However, a significant percentage of patients are unable to tolerate statins due to side effects, particularly muscle pain and muscle toxicity (statin-associated myopathy).

Bempedoic Acid (Nexletol) offers a differentiated mechanism of action. Unlike statins, which act in muscle tissue and can cause muscle-related side effects, Bempedoic Acid is activated only in the liver and not in muscle tissue. It lowers LDL cholesterol effectively while avoiding the muscle-related side effects.

There are an estimated 70 million statin-intolerant or inadequately controlled cholesterol patients in the United States alone, representing a massive long-term market opportunity.

Bempedoic Acid has received a Class I, Level A recommendation in updated ESC/EAS cholesterol management guidelines — the strongest possible endorsement.`
  },
  pharma_nexletol_stage: {
    title: "Nexletol: Entering the High-Growth Inflection Phase",
    content: `Every successful pharmaceutical follows a predictable adoption curve:

Stage 1 – Introduction: Adoption is slow. Physicians remain cautious, insurance coverage is limited, and prescriptions grow gradually.

Stage 2 – Inflection Point (Rapid Adoption): Clinical guidelines begin recommending the drug, insurance reimbursement expands, and prescriptions accelerate rapidly.

Stage 3 – Maturity and Patent Expiry: Growth stabilizes, patent expiration introduces generic competition.

Nexletol is currently transitioning from Stage 1 to Stage 2 — the most value-creating phase. Key indicators:
• Prescribing base growing — now ~45,000 healthcare providers
• +34% Retail Prescription Equivalents YoY
• >90% commercial lives and Medicare payer coverage
• Class I, Level A recommendation in European guidelines — expected to inform upcoming U.S. guidelines
• Generic entry restricted until April 2040 (agreement with Dr. Reddy's and others)

Blue Jet holds a supply contract valid until patent expiry in CY2031, providing multi-year demand visibility.`
  },
  pharma_vizag: {
    title: "Vizag Greenfield Facility",
    content: `The Vizag project represents Blue Jet's most important long-term expansion initiative.

Key Highlights:
• Total planned investment: ₹1,000 crore over 3–4 years
• Focus: Dedicated capacity for APIs and advanced intermediates aligned with customer requirements
• Objective: Strengthen Blue Jet's position as a global partner in complex chemistries
• Customer alignment: Capacity is being built against identified products and customer demand

Additionally, Blue Jet has invested ₹40 Cr in a new R&D center in Hyderabad specifically to build capabilities in peptides and complex synthesis — targeting GLP-1s (weight loss drugs), Oncology, and CNS disorders.

Management has indicated six molecules currently in Phase III clinical trials for which Blue Jet supplies intermediates. These span high-value therapeutic areas. If Phase III succeeds and FDA approval is obtained, commercial volumes jump from "kilograms" to "tons" overnight — Phase III is the "Money Zone."`
  },
  pharma_divis_competition: {
    title: "Competitive Threat: Divi's Laboratories",
    content: `Divis Laboratories is expanding aggressively into the contrast media value chain, with filings for approximately 1,210 MTPA of intermediate capacity at its Kakinada facility. This capacity is capable of supporting roughly 1,600 MTPA of iodinated contrast media APIs.

However, the threat to Blue Jet is substantially mitigated by several factors:

1) Vertical Integration Strategy Differences: Divis pursues a fully integrated model covering the entire value chain. Blue Jet has adopted a more focused and capital-efficient strategy, concentrating on the most value-dense and technically complex steps.

2) Extensive regulatory approvals and customer validation, including process qualification, stability testing, and regulatory filing acceptance — all create multi-year timelines for new entrants.

3) Blue Jet's entrenched 25-year relationship with GE Healthcare, specialized iodination expertise, and regulatory integration provide meaningful protection against near-to-medium-term competitive disruption.

While Divis represents a credible long-term entrant, Blue Jet's position is well-defended.`
  },
  risk_concentration: {
    title: "Customer Concentration Risk",
    content: `GE Healthcare accounted for 63.6% of Blue Jet's total revenue in FY23. Potential risk scenarios include:

Scenario A — Volume Risk: If GE Healthcare loses market share in contrast media to Bracco, Bayer, or Guerbet, Blue Jet's intermediate volumes could decline proportionally.

Scenario B — Pricing Pressure: If GE Healthcare develops alternative suppliers or introduces new vendors such as Divi's Laboratories, it could exert pricing pressure on Blue Jet over time.

Scenario C — Logistical Disruptions: During FY25, logistical disruptions such as the Red Sea crisis led to inventory buildup and shipment delays. Transit time increased from 35-40 days to 60 days. Only 55% of production was recognized as revenue in the affected quarter, with the rest in transit.

However, this relationship reflects structural supply chain integration rather than fragile dependence — Blue Jet is embedded within GE's regulatory filings and manufacturing processes.`
  },
  risk_cdmo_lumpiness: {
    title: "CDMO Revenue Lumpiness",
    content: `The Pharma Intermediates & API segment operates under the CDMO model, which inherently produces uneven revenue recognition:

Typical pattern:
• Quarter 1: Large intermediate shipment → Revenue spikes
• Quarter 2: Customer consumes inventory → Limited or no new orders → Revenue declines
• Quarter 3+: Orders resume → Revenue normalizes

In FY26, Pharma Intermediate revenue declined ~72% YoY (₹146.5 Cr in Q3 FY25 to ₹40.1 Cr in Q3 FY26). Management clarified this was primarily due to inventory destocking and order phasing by a key Bempedoic Acid customer as they focus on manufacturing process optimization and technology transfer.

This is a transient normalization commonly observed during early commercialization, not structural demand destruction. Volume recovery expected Q4 FY26 or early FY27 aligned with manufacturing ramp-up.`
  },
  risk_promoter: {
    title: "Promoter Shareholding & Dilution Risk",
    content: `Promoters currently hold approximately ~79% of the company, reduced from ~85% following the IPO. As per SEBI regulations, promoters must reduce their shareholding to 75% within three years of listing (deadline: October 2026).

This implies potential future share sales through Offer for Sale (OFS), institutional placements, or secondary market transactions.

While this does not impact business fundamentals, it could create short-term stock price volatility due to increased supply of shares.`
  },
  cm_ge_relationship: {
    title: "The GE Healthcare Relationship: 25 Years Deep",
    content: `GE Healthcare accounted for 63.6% of Blue Jet's revenue in FY23, which appears to represent significant customer concentration risk. However, this relationship reflects structural supply chain integration rather than fragile dependence.

Critical Supplier Status: Blue Jet is one of the largest global suppliers of ABA HCl, a key advanced intermediate used in iodinated contrast media. These intermediates are embedded within GE's regulatory filings and manufacturing processes, making supplier replacement complex and time-consuming.

Strong Volume Visibility from GE's Capacity Expansion: GE Healthcare invested $80 million in November 2022 to expand contrast media production capacity in Norway by approximately 30%. Peter Arduini, CEO of GE HealthCare stated: "Supply is rather tight within the industry just based on the players that exist."

GE's expansion means more intermediates needed — directly benefiting Blue Jet as an established, validated supplier.`
  }
};

// ─── Know More Button Component ───

const KnowMoreButton: React.FC<{ id: string; label?: string }> = ({ id, label }) => {
  const [open, setOpen] = useState(false);
  const data = KNOW_MORE_CONTENT[id];
  if (!data) return null;

  return (
    <span className="inline-block align-middle">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 text-xs font-medium rounded-full
          bg-primary/10 text-primary border border-primary/20
          hover:bg-primary/20 hover:border-primary/40 transition-all duration-200
          active:scale-95 cursor-pointer"
      >
        <Info className="w-3 h-3" />
        {label || "Know more"}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 mb-2 p-4 rounded-xl bg-muted/60 border border-border/60 text-sm text-foreground/85 leading-relaxed whitespace-pre-line">
              <h4 className="font-semibold text-foreground mb-2 text-base">{data.title}</h4>
              {data.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

// ─── Segment Card Component ───

interface SegmentData {
  number: number;
  segment: string;
  icon: React.ReactNode;
  yearStarted: string;
  brief: React.ReactNode;
  industryNuances: React.ReactNode;
  financials: React.ReactNode;
  growthLevers: React.ReactNode;
  expectedGrowth: React.ReactNode;
  accentColor: string;
}

const SegmentCard: React.FC<{ data: SegmentData; index: number }> = ({ data, index }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    {/* Header */}
    <div className={`px-6 py-5 border-b border-border/40 ${data.accentColor}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-background/80 backdrop-blur-sm">
          {data.icon}
        </div>
        <div>
          <Badge variant="outline" className="mb-1 text-xs">Since {data.yearStarted}</Badge>
          <h2 className="text-xl font-bold text-foreground">{data.segment}</h2>
        </div>
      </div>
    </div>

    {/* Grid content */}
    <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border/30">
      <DetailCell label="Brief" content={data.brief} />
      <DetailCell label="Industry Nuances" content={data.industryNuances} />
      <DetailCell label="Financials" content={data.financials} />
      <DetailCell label="Growth Levers" content={data.growthLevers} />
      <DetailCell label="Expected Growth" content={data.expectedGrowth} />
    </div>
  </motion.section>
);

const DetailCell: React.FC<{ label: string; content: React.ReactNode }> = ({ label, content }) => (
  <div className="p-5 space-y-2">
    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</h3>
    <div className="text-sm text-foreground/90 leading-relaxed">{content}</div>
  </div>
);

// ─── Risk Card ───

const RiskCard: React.FC<{ number: number; title: string; content: React.ReactNode }> = ({ number, title, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-5 rounded-xl border border-destructive/20 bg-destructive/5"
  >
    <div className="flex items-center gap-2 mb-3">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive/15 text-destructive text-xs font-bold">{number}</span>
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
    <div className="text-sm text-foreground/80 leading-relaxed">{content}</div>
  </motion.div>
);

// ─── Main Page ───

const BlueJetReport: React.FC = () => {
  const navigate = useNavigate();

  const segments: SegmentData[] = [
    {
      number: 1,
      segment: "High-Intensity Sweeteners",
      icon: <Candy className="w-6 h-6 text-amber-500" />,
      yearStarted: "1968",
      accentColor: "bg-amber-500/5",
      brief: (
        <div>
          <p>Saccharin sweetener found in FMCG and healthcare products.</p>
          <p className="mt-2">Blue Jet as <strong>10% global share</strong> and one of few non-Chinese players left.</p>
        </div>
      ),
      industryNuances: (
        <div className="space-y-3">
          <p>1) Significant defensive barrier, as product not sold on chemistry but <strong>sensory consistency</strong>
            <KnowMoreButton id="sweetener_sensory" />
          </p>
          <p>2) For oral care and pharmaceutical application, supplier must meet pharma-grade standards (Blue Jet only Indian manufacturer)
            <KnowMoreButton id="sweetener_pharma_grade" />
          </p>
          <p>3) Resistant to temporary price change and as seen during <strong>China dumping in 2024</strong>
            <KnowMoreButton id="sweetener_china_dumping" />
          </p>
        </div>
      ),
      financials: (
        <div>
          <div className="space-y-1">
            <p><strong>FY 25</strong></p>
            <p>Revenue share — <strong>13%</strong></p>
            <p>Revenue — xx Cr</p>
            <p>EBITDA — XX</p>
            <p>PAT — YY</p>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
            Historical growth: 2% CAGR from 2000
          </div>
        </div>
      ),
      growthLevers: (
        <div>
          <p>Developing with large global FMCG customer on a <strong>new-generation sweetener molecule</strong> (distinct from saccharin) with global market size of ~$1 billion; which has <strong>4-5x higher realisation</strong> as compared to current saccharin products
            <KnowMoreButton id="sweetener_new_molecule" />
          </p>
        </div>
      ),
      expectedGrowth: <p>Low single-digit growth in legacy saccharin. Potential step-change if new sweetener molecule commercializes from Vizag facility.</p>,
    },
    {
      number: 2,
      segment: "Contrast Media Intermediates",
      icon: <FlaskConical className="w-6 h-6 text-sky-500" />,
      yearStarted: "2000",
      accentColor: "bg-sky-500/5",
      brief: (
        <div>
          <p>Chemical dye used in MRI and CT scans to make internal structures visible.</p>
          <p className="mt-2"><strong>2 types:</strong></p>
          <p>1) Iodinated — in X-ray and CT scan — <strong>74% market share</strong></p>
          <p>2) Gadolinium — used in MRI — <strong>24% market share</strong></p>
        </div>
      ),
      industryNuances: (
        <div className="space-y-3">
          <p>1) 4 global players control ~75% volume (Blue Jet supplier to 3 of top 4)
            <KnowMoreButton id="cm_oligopoly" />
          </p>
          <p>2) Final drug manufacturers can't easily change suppliers due to need of re-processing regulatory approvals
            <KnowMoreButton id="cm_switching_costs" />
          </p>
          <p>3) GE Healthcare — a <strong>25-year relationship</strong>, 63.6% of FY23 revenue
            <KnowMoreButton id="cm_ge_relationship" />
          </p>
          <p>4) Competitive threat from Divi's Laboratories entering the space
            <KnowMoreButton id="pharma_divis_competition" />
          </p>
        </div>
      ),
      financials: (
        <div>
          <div className="space-y-1">
            <p><strong>FY 25</strong></p>
            <p>Revenue share — <strong>39%</strong></p>
            <p>Revenue — xx Cr</p>
            <p>EBITDA — XX</p>
            <p>PAT — YY</p>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
            Historical growth: 15% CAGR from 2017
          </div>
        </div>
      ),
      growthLevers: (
        <div className="space-y-3">
          <p><strong>Forward Integration Iodinated</strong> — Moving higher up the value chain from stage 2 to stage 3; 16x increase in value per kg
            <KnowMoreButton id="cm_value_chain" />
          </p>
          <p><strong>Superior Iodine recovery</strong> — ~80-85% recovery efficiency; saving ~40% cost of iodine
            <KnowMoreButton id="cm_iodine" />
          </p>
          <p><strong>Backward Integration</strong> — Setting up raw material plant for APD (Amino Phenol Derivative) to reduce ~50% COGS dependency on China
            <KnowMoreButton id="cm_backward" />
          </p>
          <p><strong>Gadopiclenol</strong> — Blue Jet commercialized a key intermediate for a novel MRI contrast agent with patent protection till 2039
            <KnowMoreButton id="cm_gadopiclenol" />
          </p>
        </div>
      ),
      expectedGrowth: (
        <div className="space-y-2">
          <p>During FY2025, Blue Jet commercialized a key intermediate for <strong>Gadopiclenol</strong>, a novel MRI contrast agent — Strengths:</p>
          <p>1) Customers have patent protection till 2039; additional 14 year exclusivity</p>
          <p>2) 50% lower dose than current product in market</p>
          <p>3) Final product already approved in EU and US and expanding to US and Canada</p>
        </div>
      ),
    },
    {
      number: 3,
      segment: "Pharma Intermediates & APIs (including CDMO)",
      icon: <Pill className="w-6 h-6 text-emerald-500" />,
      yearStarted: "2020",
      accentColor: "bg-emerald-500/5",
      brief: (
        <div>
          <p><strong>Bempedoic Acid</strong> — a key component in <strong>Nexletol</strong>, a first-in-class, non-statin cholesterol-lowering drug developed by Esperion Therapeutics.</p>
          <p className="mt-2"><strong>6 Phase 2 molecules</strong> spanning Oncology (Cancer), CNS disorders, and GLP-1s (weight loss drugs).</p>
        </div>
      ),
      industryNuances: (
        <div className="space-y-3">
          <p>Significant percentage of patients are unable to tolerate statins (existing drug alternative) due to side effects, particularly <strong>muscle pain and muscle toxicity</strong>; hence there exist a large unmet medical need in cardiovascular treatment
            <KnowMoreButton id="pharma_statins" />
          </p>
        </div>
      ),
      financials: (
        <div>
          <div className="space-y-1">
            <p><strong>FY 25</strong></p>
            <p>Revenue share — <strong>39%</strong></p>
            <p>Revenue — xx Cr</p>
            <p>EBITDA — XX</p>
            <p>PAT — YY</p>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground">
            Historical growth: 15% CAGR from 2017
          </div>
        </div>
      ),
      growthLevers: (
        <div className="space-y-3">
          <p><strong>Nexletol transitioning from Stage 1 (Introduction) to Stage 2 (Rapid Adoption)</strong>, the most value-creating phase in a drug's lifecycle
            <KnowMoreButton id="pharma_nexletol_stage" />
          </p>
          <p><strong>Vizag greenfield facility</strong> — Planned investment ₹1,000 crore over 3–4 years. New R&D center in Hyderabad (₹40 Cr) to build capabilities in peptides and complex synthesis
            <KnowMoreButton id="pharma_vizag" />
          </p>
        </div>
      ),
      expectedGrowth: (
        <div className="space-y-2">
          <p><strong>Blue Jet has invested ₹40 Cr in a new R&D center</strong> in Hyderabad specifically to build capabilities in peptides and complex synthesis.</p>
          <p>6 molecules in Phase III clinical trials across Oncology, CNS, and GLP-1s — if approved, volumes jump from "kilograms" to "tons" overnight.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">Blue Jet Healthcare Ltd</h1>
            <p className="text-xs text-muted-foreground">Business Note · Feb 2026</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-card via-card to-muted/30 border border-border/50 p-6 sm:p-8"
        >
          <p className="text-base sm:text-lg text-foreground/85 leading-relaxed max-w-4xl">
            Stocks fell nearly <strong>64% from their peak</strong>, largely due to a lack of business understanding among investors. Many investors rushed to price the company purely based on the CDMO segment's revenue spike, misinterpreting temporary revenue lumpiness as sustainable growth.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Sweeteners — 13% Revenue</Badge>
            <Badge className="bg-sky-500/10 text-sky-600 border-sky-500/20">Contrast Media — 39% Revenue</Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Pharma & CDMO — 45% Revenue</Badge>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Blue Jet operates at the intersection of three specialized, high-barrier industrial segments — transforming from a commodity chemical manufacturer into a specialty pharmaceutical intermediates and CDMO player embedded in global innovator supply chains.
          </p>
        </motion.div>

        {/* Segments */}
        <div className="space-y-6">
          {segments.map((seg, i) => (
            <SegmentCard key={seg.number} data={seg} index={i} />
          ))}
        </div>

        {/* Significant Event */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-foreground">Significant Event: Q2 Revenue Fall</h2>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed max-w-4xl">
            Revenue fell sharply YoY (~72%) due to temporary inventory destocking and order phasing by a key Bempedoic Acid customer, not demand loss. The customer is currently optimizing its manufacturing process, leading to lower short-term offtake. This fluctuation is typical in early commercialization phases and represents a transient normalization rather than a structural issue.
          </p>
        </motion.section>

        {/* Risk Factors */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-destructive" /> Risk Factors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RiskCard
              number={1}
              title="Customer Concentration Risk"
              content={
                <div>
                  <p>GE Healthcare accounted for 63.6% of Blue Jet's total revenue. It presents following risks: 1. Volume 2. Pricing 3. Logistics — as reflected in FY 25; due to Red Sea issue.</p>
                  <KnowMoreButton id="risk_concentration" />
                </div>
              }
            />
            <RiskCard
              number={2}
              title="CDMO Business Cyclicality and Revenue Lumpiness"
              content={
                <div>
                  <p>Promoters currently hold approximately ~35% of the company, reduced from ~85% following the IPO.</p>
                  <KnowMoreButton id="risk_cdmo_lumpiness" />
                </div>
              }
            />
            <RiskCard
              number={3}
              title="Promoter Shareholding and Regulatory Dilution Risk"
              content={
                <div>
                  <p>Promoters currently hold ~79% of the company. As per SEBI regulations, promoters must reduce to 75% by October 2026.</p>
                  <KnowMoreButton id="risk_promoter" />
                </div>
              }
            />
          </div>
        </motion.section>

        {/* Disclaimer */}
        <div className="py-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
            <strong>Disclaimer:</strong> This material is provided solely for informational and educational purposes and does not constitute investment advice. The author may hold positions in the securities discussed. Past performance is not indicative of future results. All investments involve risk, including the possible loss of principal. Investors should conduct their own independent research and consult with a qualified financial advisor.
          </p>
        </div>
      </main>
    </div>
  );
};

export default BlueJetReport;
