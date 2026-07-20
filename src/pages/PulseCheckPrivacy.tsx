import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Heart, Shield, Smartphone, Camera, Bug, Database, Users, Globe, Mail, FileText, Lock, Trash2, BarChart3, Megaphone, CreditCard } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" as const },
  }),
};

const SectionIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[hsl(12,76%,52%/0.12)] flex items-center justify-center">
    <Icon className="w-5 h-5 text-[hsl(12,76%,52%)]" />
  </div>
);

const Section = ({
  icon,
  title,
  children,
  index,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  index: number;
}) => (
  <motion.section
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-40px" }}
    variants={fadeIn}
    className="space-y-4"
  >
    <div className="flex items-center gap-3">
      <SectionIcon icon={icon} />
      <h2 className="text-xl sm:text-2xl font-bold text-[hsl(0,0%,12%)]">{title}</h2>
    </div>
    <div className="pl-[52px] space-y-3 text-[hsl(0,0%,30%)] leading-relaxed text-[15px]">
      {children}
    </div>
  </motion.section>
);

const Bullet = ({ bold, children }: { bold?: string; children?: React.ReactNode }) => (
  <li className="flex items-start gap-2">
    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[hsl(12,76%,52%)] flex-shrink-0" />
    <span>
      {bold && <strong className="text-[hsl(0,0%,12%)]">{bold}</strong>}
      {children}
    </span>
  </li>
);

const PulseCheckPrivacy = () => {
  return (
    <div className="min-h-screen bg-[hsl(20,30%,97%)]">
      <Helmet>
        <title>PulseCheck Privacy Policy — Heart Rate & HRV App</title>
        <meta name="description" content="Privacy policy for PulseCheck, the iOS heart rate & HRV monitor. All measurements stay on your device — no accounts, no health data uploads." />
        <meta property="og:title" content="PulseCheck Privacy Policy" />
        <meta property="og:description" content="How PulseCheck handles your data: on-device measurements, no accounts, anonymous analytics only." />
        <meta property="og:url" content="https://chirayuapp.lovable.app/pulsecheck/privacy" />
        <meta name="twitter:title" content="PulseCheck Privacy Policy" />
        <meta name="twitter:description" content="On-device heart rate & HRV. No accounts. No health data uploads." />
        <link rel="canonical" href="https://chirayuapp.lovable.app/pulsecheck/privacy" />
      </Helmet>
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-[hsl(12,76%,52%)] via-[hsl(16,80%,58%)] to-[hsl(25,85%,60%)] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative container max-w-3xl mx-auto px-5 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6"
          >
            <Heart className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-white/80 text-lg font-medium"
          >
            Pulse Check
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-white/60 text-sm"
          >
            Last Updated: May 21, 2026
          </motion.p>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl mx-auto px-5 py-12 sm:py-16 space-y-10">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[hsl(12,76%,52%/0.15)] bg-white p-6 shadow-sm"
        >
          <p className="text-[hsl(0,0%,30%)] leading-relaxed">
            Pulse Check ("we", "our", "us") respects your privacy. This Privacy Policy explains how information is handled when you use the Pulse Check mobile application (the "App").
          </p>
        </motion.div>

        {/* 1. Overview */}
        <Section icon={Smartphone} title="1. Overview" index={1}>
          <p>
            Pulse Check is a wellness application that estimates heart rate and heart rate variability (HRV) using your device camera.
          </p>
          <p className="font-semibold text-[hsl(0,0%,12%)]">The App:</p>
          <ul className="space-y-2">
            <Bullet>Does not require account creation</Bullet>
            <Bullet>Does not require login</Bullet>
            <Bullet>Does not collect personal identifiers</Bullet>
            <Bullet>Does not sell or share your data</Bullet>
            <Bullet>Stores your data locally on your device</Bullet>
          </ul>
        </Section>

        {/* 2. Information We Process */}
        <Section icon={FileText} title="2. Information We Process" index={2}>
          <h3 className="font-bold text-[hsl(0,0%,12%)] text-base">A. Health & Measurement Data (Stored Locally)</h3>
          <p>When you use the App, we process:</p>
          <ul className="space-y-2">
            <Bullet>Heart rate (BPM)</Bullet>
            <Bullet>Heart rate variability (RMSSD, SDNN)</Bullet>
            <Bullet>Derived wellness metrics (e.g., stress score, recovery state, body battery score)</Bullet>
            <Bullet>Timestamps of measurements</Bullet>
            <Bullet>Optional contextual inputs (sleep quality, stress level, training, alcohol, meals)</Bullet>
          </ul>
          <div className="rounded-xl bg-[hsl(12,76%,52%/0.06)] border border-[hsl(12,76%,52%/0.12)] p-4 space-y-1 text-sm">
            <p>✓ Processed on-device</p>
            <p>✓ Stored locally on your device</p>
            <p>✓ Not transmitted to our servers</p>
          </div>

          <h3 className="font-bold text-[hsl(0,0%,12%)] text-base pt-2">B. Apple Health Integration (Optional)</h3>
          <p>If you choose to connect Apple Health:</p>
          <ul className="space-y-2">
            <Bullet>We may read heart rate and HRV data from Apple Health.</Bullet>
            <Bullet>We may write measurement results back to Apple Health.</Bullet>
            <Bullet>We only access the specific data types you authorize in Apple Health settings.</Bullet>
            <Bullet>Apple processes Health data under its own Privacy Policy.</Bullet>
          </ul>

          <h3 className="font-bold text-[hsl(0,0%,12%)] text-base pt-2">C. Camera Access</h3>
          <p>
            The App uses the device camera and flash to detect pulse signals through your fingertip (photoplethysmography).
          </p>
          <ul className="space-y-2">
            <Bullet>No photos or videos are recorded.</Bullet>
            <Bullet>No camera data is stored.</Bullet>
            <Bullet>No camera data is transmitted.</Bullet>
            <Bullet>Signal processing happens entirely on-device.</Bullet>
          </ul>

          <h3 className="font-bold text-[hsl(0,0%,12%)] text-base pt-2">D. Crash Reporting</h3>
          <p>We use Sentry to monitor app crashes and technical errors. Sentry may collect:</p>
          <ul className="space-y-2">
            <Bullet>Device model</Bullet>
            <Bullet>Operating system version</Bullet>
            <Bullet>App version</Bullet>
            <Bullet>Error logs</Bullet>
            <Bullet>Anonymous technical diagnostics</Bullet>
          </ul>
          <p className="text-sm italic text-[hsl(0,0%,45%)]">
            This information is used solely to improve app stability. No health data is intentionally transmitted to Sentry.
          </p>
        </Section>

        {/* E. Product Analytics */}
        <Section icon={BarChart3} title="E. Product Analytics" index={2.5}>
          <p>
            We use a privacy-focused analytics service (PostHog) to understand how users interact with the App and improve product performance.
          </p>
          <p className="font-semibold text-[hsl(0,0%,12%)]">This may include:</p>
          <ul className="space-y-2">
            <Bullet>Anonymous device identifier</Bullet>
            <Bullet>App version</Bullet>
            <Bullet>Device model and operating system</Bullet>
            <Bullet>Screens viewed</Bullet>
            <Bullet>Feature usage events</Bullet>
            <Bullet>App session activity</Bullet>
          </ul>
          <p className="font-semibold text-[hsl(0,0%,12%)] pt-2">We do not collect:</p>
          <ul className="space-y-2">
            <Bullet>Name</Bullet>
            <Bullet>Email address</Bullet>
            <Bullet>Health measurement values</Bullet>
            <Bullet>Location data</Bullet>
            <Bullet>Advertising identifiers</Bullet>
            <Bullet>Data for cross-app tracking</Bullet>
          </ul>
          <p className="text-sm italic text-[hsl(0,0%,45%)]">
            Analytics data is used solely for product improvement and stability monitoring.
          </p>
        </Section>

        {/* F. Meta Attribution & ATT */}
        <Section icon={Megaphone} title="F. Attribution & Ad Performance (Meta)" index={2.6}>
          <p>
            We use Meta technologies (such as the Meta SDK) for attribution and ad performance measurement — to understand which campaigns help people discover Pulse Check and how the App performs after install.
          </p>
          <p className="font-semibold text-[hsl(0,0%,12%)]">App Tracking Transparency (ATT):</p>
          <ul className="space-y-2">
            <Bullet>On iOS, the App may present Apple's <strong className="text-[hsl(0,0%,12%)]">App Tracking Transparency</strong> prompt asking permission to track activity across other apps and websites.</Bullet>
            <Bullet>Tracking permission is used to improve <strong className="text-[hsl(0,0%,12%)]">ad attribution and performance measurement</strong> only.</Bullet>
            <Bullet>If you decline, the App continues to work normally — attribution falls back to privacy-preserving signals such as Apple's SKAdNetwork.</Bullet>
            <Bullet>You can change this choice at any time in <strong className="text-[hsl(0,0%,12%)]">iOS Settings → Privacy &amp; Security → Tracking</strong>.</Bullet>
          </ul>
          <p className="font-semibold text-[hsl(0,0%,12%)] pt-2">We do not share with Meta:</p>
          <ul className="space-y-2">
            <Bullet>Heart rate, HRV, or any health measurement values</Bullet>
            <Bullet>Apple Health data</Bullet>
            <Bullet>Contextual wellness inputs (sleep, stress, meals, etc.)</Bullet>
          </ul>
        </Section>

        {/* G. Subscriptions & Payments */}
        <Section icon={CreditCard} title="G. Subscriptions & Payments (RevenueCat)" index={2.7}>
          <p>
            We use <strong className="text-[hsl(0,0%,12%)]">RevenueCat</strong> to manage subscription entitlements and validate App Store purchases.
          </p>
          <p className="font-semibold text-[hsl(0,0%,12%)]">RevenueCat may process:</p>
          <ul className="space-y-2">
            <Bullet>An anonymous subscriber identifier</Bullet>
            <Bullet>Apple App Store receipt and purchase status</Bullet>
            <Bullet>Subscription plan, renewal, and trial state</Bullet>
            <Bullet>Device and app version metadata</Bullet>
          </ul>
          <p className="text-sm italic text-[hsl(0,0%,45%)]">
            All payments are processed directly by Apple. We never see or store your payment card details. No health data is sent to RevenueCat.
          </p>
        </Section>




        <Section icon={Database} title="3. Data Storage" index={3}>
          <ul className="space-y-2">
            <Bullet>All measurement and wellness data is stored locally on your device.</Bullet>
            <Bullet>If you delete the app, your locally stored data is deleted unless backed up via iOS system backups.</Bullet>
            <Bullet>We do not maintain remote user accounts or cloud storage.</Bullet>
          </ul>
        </Section>

        {/* 4. Data Sharing */}
        <Section icon={Shield} title="4. Data Sharing" index={4}>
          <p className="font-semibold text-[hsl(0,0%,12%)]">We do not:</p>
          <ul className="space-y-2">
            <Bullet>Sell personal data</Bullet>
            <Bullet>Share health data with advertisers</Bullet>
            <Bullet>Use health data for marketing</Bullet>
            <Bullet>Share identifiable data with third parties</Bullet>
          </ul>
          <p className="text-sm text-[hsl(0,0%,45%)]">
            Crash reporting data is processed by Sentry as a service provider for technical stability purposes only.
          </p>
        </Section>

        {/* 5. Data Retention */}
        <Section icon={Trash2} title="5. Data Retention" index={5}>
          <p>Because we do not maintain user accounts:</p>
          <ul className="space-y-2">
            <Bullet>Your data remains on your device until you delete it.</Bullet>
            <Bullet>You may delete all data at any time via <strong className="text-[hsl(0,0%,12%)]">Settings → Delete All Data</strong>.</Bullet>
            <Bullet>Deleting the app removes locally stored data.</Bullet>
          </ul>
        </Section>

        {/* 6. Children's Privacy */}
        <Section icon={Users} title="6. Children's Privacy" index={6}>
          <p>
            Pulse Check is intended for users 18 years or older. We do not knowingly collect data from children. If we learn that data has been inadvertently collected from anyone under 18, we will take steps to delete it promptly.
          </p>
        </Section>

        {/* 7. Security */}
        <Section icon={Lock} title="7. Security" index={7}>
          <p>We implement reasonable technical safeguards, including:</p>
          <ul className="space-y-2">
            <Bullet>On-device processing</Bullet>
            <Bullet>Encrypted transmission for crash diagnostics</Bullet>
            <Bullet>Secure platform storage mechanisms</Bullet>
          </ul>
          <p>
            While no system is 100% secure, we strive to apply industry-standard measures to protect any data processed by the App.
          </p>
        </Section>

        {/* 8. International Users */}
        <Section icon={Globe} title="8. International Users" index={8}>
          <p>
            Crash reporting data may be processed in the United States via Sentry infrastructure. By using the App, you consent to the transfer of crash diagnostic data to these servers.
          </p>
        </Section>

        {/* 9. Your Rights */}
        <Section icon={FileText} title="9. Your Rights" index={9}>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="space-y-2">
            <Bullet bold="Access: ">View all data stored by the App (available locally on your device).</Bullet>
            <Bullet bold="Deletion: ">Delete all data via Settings → Delete All Data or by uninstalling the App.</Bullet>
            <Bullet bold="Opt-Out: ">Revoke Apple Health permissions at any time in your device settings.</Bullet>
            <Bullet bold="Portability: ">Since data is stored locally, you retain full control over it.</Bullet>
          </ul>
        </Section>

        {/* 10. Third-Party Services */}
        <Section icon={Shield} title="10. Third-Party Services" index={10}>
          <p>The App may interact with the following third-party services:</p>
          <ul className="space-y-2">
            <Bullet bold="Sentry: ">Crash reporting and error monitoring (<a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-[hsl(12,76%,52%)] underline underline-offset-2 hover:text-[hsl(12,76%,42%)] transition-colors">Sentry Privacy Policy</a>)</Bullet>
            <Bullet bold="PostHog: ">Privacy-focused product analytics (<a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[hsl(12,76%,52%)] underline underline-offset-2 hover:text-[hsl(12,76%,42%)] transition-colors">PostHog Privacy Policy</a>)</Bullet>
            <Bullet bold="Apple Health: ">Optional health data integration (<a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-[hsl(12,76%,52%)] underline underline-offset-2 hover:text-[hsl(12,76%,42%)] transition-colors">Apple Privacy Policy</a>)</Bullet>
            <Bullet bold="Meta: ">Attribution and ad performance measurement, subject to ATT (<a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-[hsl(12,76%,52%)] underline underline-offset-2 hover:text-[hsl(12,76%,42%)] transition-colors">Meta Privacy Policy</a>)</Bullet>
            <Bullet bold="RevenueCat: ">Subscription management and purchase validation (<a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[hsl(12,76%,52%)] underline underline-offset-2 hover:text-[hsl(12,76%,42%)] transition-colors">RevenueCat Privacy Policy</a>)</Bullet>
          </ul>
        </Section>

        {/* 11. Changes */}
        <Section icon={FileText} title="11. Changes to This Policy" index={11}>
          <p>
            We may update this Privacy Policy from time to time. Changes will be reflected with a new "Last Updated" date at the top of this page. We encourage you to review this policy periodically.
          </p>
        </Section>

        {/* 12. Contact */}
        <Section icon={Mail} title="12. Contact" index={12}>
          <p>If you have questions about this Privacy Policy, contact:</p>
          <a
            href="mailto:rahulkumar.iitb@gmail.com"
            className="inline-flex items-center gap-2 mt-2 px-5 py-3 rounded-xl bg-[hsl(12,76%,52%)] text-white font-medium text-sm hover:bg-[hsl(12,76%,45%)] transition-colors shadow-md shadow-[hsl(12,76%,52%/0.25)]"
          >
            <Mail className="w-4 h-4" />
            rahulkumar.iitb@gmail.com
          </a>
        </Section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-[hsl(12,76%,52%/0.1)] pt-8 mt-12 text-center text-sm text-[hsl(0,0%,55%)]"
        >
          <p>© {new Date().getFullYear()} Pulse Check. All rights reserved.</p>
          <p className="mt-1">Your health data stays on your device. Always.</p>
        </motion.footer>
      </main>
    </div>
  );
};

export default PulseCheckPrivacy;
