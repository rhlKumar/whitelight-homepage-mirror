import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Target,
  Scale,
  Share2,
  Lock,
  Database,
  UserCheck,
  Trash2,
  Users,
  Link2,
  Globe,
  RefreshCw,
  Mail,
  ShieldCheck,
} from "lucide-react";

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

const COMPANY_NAME = "Whitelight Ventures LLP";
const SUPPORT_EMAIL = "company@whitelightventure.com";
const LAST_UPDATED = "August 25, 2026";

type Props = {
  appName: string;
  slug: string;
};

const WellnessPrivacy = ({ appName, slug }: Props) => {
  const url = `https://whitelightventure.com/${slug}/privacy`;

  return (
    <div className="min-h-screen bg-[hsl(20,30%,97%)]">
      <Helmet>
        <title>{appName} Privacy Policy</title>
        <meta
          name="description"
          content={`Privacy policy for ${appName}, operated by ${COMPANY_NAME}. Learn how we collect, use, and protect your information.`}
        />
        <meta property="og:title" content={`${appName} Privacy Policy`} />
        <meta
          property="og:description"
          content={`How ${appName} handles your data: information we collect, how it's used, your rights, and how to request deletion.`}
        />
        <meta property="og:url" content={url} />
        <meta name="twitter:title" content={`${appName} Privacy Policy`} />
        <meta
          name="twitter:description"
          content={`Privacy policy for ${appName}, operated by ${COMPANY_NAME}.`}
        />
        <link rel="canonical" href={url} />
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
            <Shield className="w-8 h-8" />
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
            {appName}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-white/60 text-sm"
          >
            Last Updated: {LAST_UPDATED}
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
            {appName} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) respects your privacy.
            This Privacy Policy explains how we collect, use, and protect your information when
            you use the {appName} mobile application and website (the &ldquo;Platform&rdquo;),
            operated by {COMPANY_NAME} (&ldquo;Company&rdquo;, &ldquo;We&rdquo;, &ldquo;Us&rdquo;, or &ldquo;Our&rdquo;).
          </p>
          <p className="text-[hsl(0,0%,30%)] leading-relaxed mt-3">
            By accessing {appName}, you agree to the practices described in this Privacy Policy.
            If you do not agree, please discontinue use of the Platform immediately.
          </p>
        </motion.div>

        {/* 1. Information We Collect */}
        <Section icon={FileText} title="1. Information We Collect" index={1}>
          <h3 className="font-bold text-[hsl(0,0%,12%)] text-base">Information You Provide</h3>
          <ul className="space-y-2">
            <Bullet bold="Account Information: ">
              Name, mobile number, age, email address obtained through Google authentication
              (Gmail login), and specific health-related information you share (e.g., goals
              regarding weight loss, PCOD, thyroid, diabetes, or addiction recovery). {appName} does
              not collect or store passwords, phone numbers, OTPs, or any other third-party login
              credentials.
            </Bullet>
            <Bullet bold="User-Generated Content: ">
              Any data, text, or media you upload or share within {appName}.
            </Bullet>
            <Bullet bold="Support Data: ">
              Messages or inquiries you send to our support team.
            </Bullet>
            <Bullet bold="Voice &amp; Communication Data: ">
              Data from our 24/7 calling service and chat interactions used solely to provide
              one-on-one guidance.
            </Bullet>
          </ul>

          <h3 className="font-bold text-[hsl(0,0%,12%)] text-base pt-2">Automatically Collected Information</h3>
          <ul className="space-y-2">
            <Bullet bold="Device Information: ">
              Device type, OS version, IP address, unique identifiers, and app version.
            </Bullet>
            <Bullet bold="Usage Data: ">
              How you interact with features, pages, and sections of the app.
            </Bullet>
            <Bullet bold="Cookies &amp; Analytics: ">
              Used for maintaining sessions and improving user experience.
            </Bullet>
          </ul>
        </Section>

        {/* 2. Purpose of Data Collection */}
        <Section icon={Target} title="2. Purpose of Data Collection" index={2}>
          <p>We use your data to:</p>
          <ul className="space-y-2">
            <Bullet>Create and manage your account using Google authentication.</Bullet>
            <Bullet>Personalize your experience and improve app functionality.</Bullet>
            <Bullet>Communicate important updates and notifications.</Bullet>
            <Bullet>Maintain security and prevent fraudulent activity.</Bullet>
            <Bullet>Comply with applicable legal obligations.</Bullet>
          </ul>
        </Section>

        {/* 3. Legal Basis for Processing */}
        <Section icon={Scale} title="3. Legal Basis for Processing" index={3}>
          <p>We process your data based on:</p>
          <ul className="space-y-2">
            <Bullet>Your consent.</Bullet>
            <Bullet>Contractual necessity (to deliver requested services).</Bullet>
            <Bullet>Legal obligations under applicable law.</Bullet>
            <Bullet>Our legitimate interest in improving and securing our services.</Bullet>
          </ul>
        </Section>

        {/* 4. Data Sharing and Disclosure */}
        <Section icon={Share2} title="4. Data Sharing and Disclosure" index={4}>
          <p>We do not sell or rent your personal data. We may share limited data with:</p>
          <ul className="space-y-2">
            <Bullet>Service Providers assisting in hosting, analytics, or technical operations.</Bullet>
            <Bullet>Legal Authorities when required by law.</Bullet>
            <Bullet>Affiliates or partners with your explicit consent.</Bullet>
          </ul>
          <p>
            All third parties handling your data are bound by strict confidentiality and data
            protection obligations.
          </p>
        </Section>

        {/* 5. Data Security */}
        <Section icon={Lock} title="5. Data Security" index={5}>
          <p>
            We use industry-standard security measures to protect your data against unauthorized
            access, alteration, disclosure, or destruction.
          </p>
          <p>
            However, no online system is completely secure, and users are encouraged to maintain
            the confidentiality of their Google account credentials.
          </p>
        </Section>

        {/* 6. Data Retention */}
        <Section icon={Database} title="6. Data Retention" index={6}>
          <p>
            We retain your data only for as long as necessary to provide our Services or as required
            by law. When data is no longer required, it is deleted, anonymized, or securely
            archived.
          </p>
        </Section>

        {/* 7. User Rights */}
        <Section icon={UserCheck} title="7. User Rights" index={7}>
          <p>You may:</p>
          <ul className="space-y-2">
            <Bullet>Access, update, or correct your personal information.</Bullet>
            <Bullet>Request deletion of your personal data.</Bullet>
            <Bullet>Withdraw consent at any time.</Bullet>
            <Bullet>Request details on how your data is processed.</Bullet>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-[hsl(12,76%,52%)] underline underline-offset-2 hover:text-[hsl(12,76%,42%)] transition-colors"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </Section>

        {/* 8. Data Deletion Request */}
        <Section icon={Trash2} title="8. Data Deletion Request (Play Store Requirement)" index={8}>
          <p>You may request complete deletion of your account and personal data at any time by:</p>
          <ul className="space-y-2">
            <Bullet>
              Emailing us at{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[hsl(12,76%,52%)] underline underline-offset-2 hover:text-[hsl(12,76%,42%)] transition-colors"
              >
                {SUPPORT_EMAIL}
              </a>
              , with the subject line &ldquo;Data Deletion Request&rdquo;; or
            </Bullet>
            <Bullet>Using the in-app &ldquo;Delete Account&rdquo; option (if available).</Bullet>
          </ul>
          <p>
            Once we verify your identity, we will permanently delete your personal data (except
            where retention is required by law) within 30 days of receiving your request.
          </p>
          <div className="rounded-xl bg-[hsl(12,76%,52%/0.06)] border border-[hsl(12,76%,52%/0.12)] p-4 text-sm">
            <p>
              Please note: deleting your account will remove all stored information and in-app
              history. This process is irreversible.
            </p>
          </div>
        </Section>

        {/* 9. Children's Privacy */}
        <Section icon={Users} title="9. Children's Privacy" index={9}>
          <p>
            {appName} is intended for users aged 18 years and above. We do not knowingly collect
            data from children below age 18. If such data is identified, it will be deleted
            immediately upon notification.
          </p>
        </Section>

        {/* 10. Third-Party Services and Links */}
        <Section icon={Link2} title="10. Third-Party Services and Links" index={10}>
          <p>
            The Platform may contain third-party links or integrations. We are not responsible for
            their privacy practices or content. Review their privacy policies before interacting
            with them.
          </p>
        </Section>

        {/* 11. International Data Transfers */}
        <Section icon={Globe} title="11. International Data Transfers" index={11}>
          <p>
            Some data may be processed or stored on servers outside India. By using the Platform,
            you consent to such transfers in accordance with applicable law.
          </p>
        </Section>

        {/* 12. Changes to This Policy */}
        <Section icon={RefreshCw} title="12. Changes to This Policy" index={12}>
          <p>
            We may update this Privacy Policy periodically. The updated version will be posted on
            this page with the revised &ldquo;Last Updated&rdquo; date. Continued use of the app
            after such changes constitutes acceptance.
          </p>
        </Section>

        {/* 13. Contact Us */}
        <Section icon={Mail} title="13. Contact Us" index={13}>
          <p>
            If you have any questions, concerns, or complaints regarding this Policy or our data
            handling practices, please contact:
          </p>
          <div className="rounded-xl border border-[hsl(12,76%,52%/0.12)] bg-white p-4 space-y-1 text-[hsl(0,0%,30%)]">
            <p className="font-bold text-[hsl(0,0%,12%)]">{COMPANY_NAME}</p>
            <p>7th Floor, B-708, Twin Tower CHS</p>
            <p>2nd Cross Lane, Lokhandwala Complex</p>
            <p>Andheri West, Mumbai</p>
            <p>Mumbai Suburban, Maharashtra 400053</p>
            <p className="pt-1">
              Email:{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-[hsl(12,76%,52%)] underline underline-offset-2 hover:text-[hsl(12,76%,42%)] transition-colors"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-2 mt-2 px-5 py-3 rounded-xl bg-[hsl(12,76%,52%)] text-white font-medium text-sm hover:bg-[hsl(12,76%,45%)] transition-colors shadow-md shadow-[hsl(12,76%,52%/0.25)]"
          >
            <Mail className="w-4 h-4" />
            {SUPPORT_EMAIL}
          </a>
        </Section>

        {/* Compliance Summary */}
        <Section icon={ShieldCheck} title="Compliance Summary" index={14}>
          <p>This Privacy Policy complies with:</p>
          <ul className="space-y-2">
            <Bullet>Google Play Data Safety and Data Deletion Requirements (2024 Update)</Bullet>
            <Bullet>Information Technology Act, 2000</Bullet>
            <Bullet>
              Information Technology (Reasonable Security Practices and Procedures and Sensitive
              Personal Data or Information) Rules, 2011
            </Bullet>
          </ul>
        </Section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-[hsl(12,76%,52%/0.1)] pt-8 mt-12 text-center text-sm text-[hsl(0,0%,55%)]"
        >
          <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
        </motion.footer>
      </main>
    </div>
  );
};

export default WellnessPrivacy;
