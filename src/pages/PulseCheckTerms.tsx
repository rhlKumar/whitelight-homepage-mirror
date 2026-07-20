import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FileText, ShieldAlert, Activity, UserCheck, Scale, Apple, Power, RefreshCw, Globe, Mail, CreditCard } from "lucide-react";

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

const PulseCheckTerms = () => {
  return (
    <div className="min-h-screen bg-[hsl(20,30%,97%)]">
      <Helmet>
        <title>PulseCheck Terms of Use — Heart Rate & HRV App</title>
        <meta name="description" content="Terms of use for PulseCheck, the iOS heart rate & HRV monitor. PulseCheck is a wellness app, not a medical device." />
        <meta property="og:title" content="PulseCheck Terms of Use" />
        <meta property="og:description" content="Terms for using PulseCheck — a wellness app for heart rate & HRV estimation. Not a medical device." />
        <meta property="og:url" content="https://chirayuapp.lovable.app/pulsecheck/terms" />
        <meta name="twitter:title" content="PulseCheck Terms of Use" />
        <meta name="twitter:description" content="Terms for using PulseCheck — wellness use only, not a medical device." />
        <link rel="canonical" href="https://chirayuapp.lovable.app/pulsecheck/terms" />
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
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6"
          >
            <FileText className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3"
          >
            Terms of Use
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
          className="rounded-2xl border border-[hsl(12,76%,52%/0.15)] bg-white p-6 shadow-sm space-y-3"
        >
          <p className="text-[hsl(0,0%,30%)] leading-relaxed">
            Please read these Terms carefully before using Pulse Check.
          </p>
          <p className="text-[hsl(0,0%,30%)] leading-relaxed font-semibold">
            By using the App, you agree to these Terms.
          </p>
        </motion.div>

        {/* 1. Not a Medical Device */}
        <Section icon={ShieldAlert} title="1. Not a Medical Device" index={1}>
          <p>Pulse Check is <strong className="text-[hsl(0,0%,12%)]">not a medical device</strong>.</p>
          <p className="font-semibold text-[hsl(0,0%,12%)]">The App:</p>
          <ul className="space-y-2">
            <Bullet>Is not intended to diagnose, treat, cure, or prevent any disease.</Bullet>
            <Bullet>Does not provide medical advice.</Bullet>
            <Bullet>Does not replace professional medical evaluation.</Bullet>
            <Bullet>All measurements are wellness estimates only.</Bullet>
          </ul>
          <div className="rounded-xl bg-[hsl(0,60%,97%)] border border-[hsl(0,60%,90%)] p-4 text-sm space-y-1">
            <p>⚠️ If you have a medical condition or concerns about your heart, consult a licensed healthcare professional.</p>
            <p>🚨 If you believe you are experiencing a medical emergency, seek immediate medical attention.</p>
          </div>
        </Section>

        {/* 2. Measurement Accuracy */}
        <Section icon={Activity} title="2. Measurement Accuracy Disclaimer" index={2}>
          <p>Pulse Check estimates heart rate and HRV using your device camera.</p>
          <p className="font-semibold text-[hsl(0,0%,12%)]">Results:</p>
          <ul className="space-y-2">
            <Bullet>May be affected by movement, lighting, finger placement, temperature, or device hardware.</Bullet>
            <Bullet>May not be clinically accurate.</Bullet>
            <Bullet>Should not be used for medical decisions.</Bullet>
          </ul>
          <p className="italic text-[hsl(0,0%,45%)] text-sm">
            You agree not to rely on the App for medical diagnosis or treatment.
          </p>
        </Section>

        {/* 3. User Responsibility */}
        <Section icon={UserCheck} title="3. User Responsibility" index={3}>
          <p>You are responsible for:</p>
          <ul className="space-y-2">
            <Bullet>Using the App appropriately</Bullet>
            <Bullet>Interpreting results as general wellness information</Bullet>
            <Bullet>Consulting a medical professional before making health-related decisions</Bullet>
          </ul>
        </Section>

        {/* 4. Limitation of Liability */}
        <Section icon={Scale} title="4. Limitation of Liability" index={4}>
          <p>To the maximum extent permitted by law, Pulse Check shall not be liable for:</p>
          <ul className="space-y-2">
            <Bullet>Medical decisions made based on App results</Bullet>
            <Bullet>Indirect or consequential damages</Bullet>
            <Bullet>Data loss resulting from device failure or deletion</Bullet>
          </ul>
          <p className="font-semibold text-[hsl(0,0%,12%)]">Your use of the App is at your own risk.</p>
        </Section>

        {/* 5. Apple Disclaimer */}
        <Section icon={Apple} title="5. Apple Disclaimer" index={5}>
          <p>If you downloaded the App from the Apple App Store:</p>
          <ul className="space-y-2">
            <Bullet>Apple is not responsible for the App.</Bullet>
            <Bullet>Apple has no obligation to provide maintenance or support.</Bullet>
            <Bullet>Apple is a third-party beneficiary of these Terms.</Bullet>
          </ul>
        </Section>

        {/* 6. Subscriptions */}
        <Section icon={CreditCard} title="6. Subscriptions" index={6}>
          <p>
            Pulse Check offers auto-renewable subscriptions through the Apple App Store.
          </p>
          <ul className="space-y-2">
            <Bullet>Available plans may include a <strong className="text-[hsl(0,0%,12%)]">weekly subscription</strong> and an <strong className="text-[hsl(0,0%,12%)]">annual subscription</strong>.</Bullet>
            <Bullet>The annual subscription may include a <strong className="text-[hsl(0,0%,12%)]">3-day free trial</strong> where offered.</Bullet>
            <Bullet>Payment is charged to your Apple ID account at confirmation of purchase.</Bullet>
            <Bullet>Subscription renews automatically unless cancelled at least <strong className="text-[hsl(0,0%,12%)]">24 hours before the end</strong> of the current billing period.</Bullet>
            <Bullet>You can manage or cancel your subscription in your Apple account settings after purchase.</Bullet>
            <Bullet>Refunds are handled by Apple according to Apple's policies.</Bullet>
          </ul>
          <p className="text-sm italic text-[hsl(0,0%,45%)]">
            Subscription billing and entitlements are managed through RevenueCat, our subscription infrastructure provider. RevenueCat does not process payment card data — all payments are handled directly by Apple.
          </p>
        </Section>

        {/* 7. Termination */}
        <Section icon={Power} title="7. Termination" index={7}>
          <ul className="space-y-2">
            <Bullet>You may stop using the App at any time.</Bullet>
            <Bullet>We reserve the right to modify or discontinue the App without notice.</Bullet>
          </ul>
        </Section>

        {/* 8. Changes to Terms */}
        <Section icon={RefreshCw} title="8. Changes to Terms" index={8}>
          <p>
            We may update these Terms periodically. Continued use of the App constitutes acceptance of the revised Terms.
          </p>
        </Section>

        {/* 9. Governing Law */}
        <Section icon={Globe} title="9. Governing Law" index={9}>
          <p>
            These Terms are governed by the laws of your jurisdiction, without regard to conflict of law principles.
          </p>
        </Section>

        {/* 9. Contact */}
        <Section icon={Mail} title="10. Contact" index={10}>
          <p>For questions regarding these Terms:</p>
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
        </motion.footer>
      </main>
    </div>
  );
};

export default PulseCheckTerms;
