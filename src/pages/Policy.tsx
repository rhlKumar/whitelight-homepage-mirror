import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Policy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <article className="bg-card rounded-lg shadow-lg p-8 space-y-6">
          <header className="border-b pb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">
              <strong>Effective Date:</strong> December 9, 2024
              <br />
              <strong>Last Updated:</strong> December 9, 2024
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to HealthInsights ("we," "our," or "us"). We are committed to protecting your privacy and ensuring
              the security of your personal health information. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our health tracking and analysis application (the
              "Service").
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using HealthInsights, you agree to the collection and use of information in accordance with this
              Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">2.1 Personal Information You Provide</h3>
            <p className="text-muted-foreground leading-relaxed">
              When you register for and use our Service, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Account Information:</strong> Email address, name, password (encrypted)
              </li>
              <li>
                <strong>Profile Information:</strong> Age, gender, health goals, preferences
              </li>
              <li>
                <strong>Health Reports:</strong> Laboratory test results, blood work data, medical reports you choose to
                upload
              </li>
              <li>
                <strong>Health History:</strong> Self-reported symptoms, conditions, medications, supplements
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">
              2.2 Wearable Device Data (Garmin Integration)
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              When you connect your Garmin wearable device, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Activity Data:</strong> Steps, distance, calories burned, active minutes, floors climbed
              </li>
              <li>
                <strong>Heart Health Data:</strong> Resting heart rate, maximum heart rate, average heart rate, heart
                rate variability (HRV)
              </li>
              <li>
                <strong>Sleep Data:</strong> Total sleep duration, sleep stages (deep, light, REM, awake), sleep quality
                scores
              </li>
              <li>
                <strong>Stress & Recovery Data:</strong> Stress levels, Body Battery™ energy levels, VO2 max
              </li>
              <li>
                <strong>Body Metrics:</strong> Weight, BMI, body fat percentage (if available from your device)
              </li>
              <li>
                <strong>Workout Data:</strong> Exercise sessions, workout types, duration, intensity
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">2.3 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Usage Data:</strong> Features accessed, time spent, interaction patterns
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating system, device identifiers
              </li>
              <li>
                <strong>Log Data:</strong> IP address, access times, error logs
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">We use the collected information for:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Health Analysis:</strong> Generate AI-powered insights from your blood work and wearable data
              </li>
              <li>
                <strong>Personalized Recommendations:</strong> Provide tailored health suggestions based on your data
              </li>
              <li>
                <strong>Progress Tracking:</strong> Monitor your health trends over time
              </li>
              <li>
                <strong>Data Visualization:</strong> Create charts and reports showing correlations between lifestyle
                factors and health markers
              </li>
              <li>
                <strong>Communication:</strong> Send important updates, health alerts, and service notifications
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Garmin Data Usage & Sharing</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">4.1 Authorization & Consent</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your Garmin wearable data is only accessed after you explicitly authorize the connection through Garmin's
              OAuth authentication process. You have complete control over this connection and can revoke it at any
              time.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">4.2 Data Storage & Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              Garmin data is stored securely in our encrypted database with the same protections as your other health
              information. We maintain this data to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Display historical trends and patterns</li>
              <li>Correlate activity, sleep, and stress with your blood work results</li>
              <li>Generate comprehensive health insights</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">4.3 Data Retention</h3>
            <p className="text-muted-foreground leading-relaxed">
              Garmin data is retained as long as your account is active and the wearable connection remains authorized.
              If you disconnect your Garmin device, we will retain the historical data for 90 days (for trend analysis
              continuity) unless you explicitly request immediate deletion.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">4.4 No Third-Party Sharing</h3>
            <p className="text-muted-foreground leading-relaxed">
              <strong>We do not sell, rent, or share your Garmin wearable data with third parties</strong> for marketing
              or commercial purposes. The only exceptions are:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Service Providers:</strong> Cloud infrastructure providers (with strict data processing
                agreements)
              </li>
              <li>
                <strong>Legal Compliance:</strong> If required by law or to protect rights and safety
              </li>
              <li>
                <strong>Your Explicit Consent:</strong> If you specifically authorize sharing with healthcare providers
                or other services
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">4.5 Compliance with Garmin Terms</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our use of Garmin Health API data complies with Garmin's Developer Agreement and Health API Terms of
              Service. We adhere to Garmin's requirements regarding data privacy, security, and user consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Encryption:</strong> All data transmitted using TLS/SSL encryption; data at rest encrypted with
                AES-256
              </li>
              <li>
                <strong>Access Control:</strong> Role-based access with multi-factor authentication for our team
              </li>
              <li>
                <strong>Infrastructure:</strong> Hosted on SOC 2 compliant cloud infrastructure with automatic backups
              </li>
              <li>
                <strong>OAuth Security:</strong> Wearable device connections secured through OAuth authentication
                standards
              </li>
              <li>
                <strong>Regular Audits:</strong> Periodic security assessments and penetration testing
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your
              information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Your Rights & Choices</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">6.1 General Data Rights</h3>
            <p className="text-muted-foreground leading-relaxed">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and all associated data
              </li>
              <li>
                <strong>Data Portability:</strong> Export your data in a machine-readable format
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from marketing communications
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">6.2 Wearable Device Controls</h3>
            <p className="text-muted-foreground leading-relaxed">For your connected wearable devices, you can:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Disconnect:</strong> Revoke access to your Garmin account at any time through the Wearables
                settings page
              </li>
              <li>
                <strong>Delete Wearable Data:</strong> Request immediate deletion of all synced wearable data
              </li>
              <li>
                <strong>Pause Syncing:</strong> Temporarily stop data synchronization without disconnecting
              </li>
              <li>
                <strong>Manage Garmin Permissions:</strong> Control what data types are shared via your Garmin account
                settings
              </li>
            </ul>

            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, contact us at: <strong>[Your Contact Email]</strong> or use the in-app settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Data Sharing & Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may share your information only in these limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>With Your Consent:</strong> When you explicitly authorize us to share with healthcare providers
                or other services
              </li>
              <li>
                <strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (hosting,
                analytics) under strict confidentiality agreements
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court order, or government request
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with
                continued protection of your data)
              </li>
              <li>
                <strong>Protection of Rights:</strong> To protect our rights, users' safety, or to investigate fraud
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>We never sell your personal health data or wearable data to third parties.</strong>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal
              information from children. If you believe we have collected information from a child, please contact us
              immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence.
              These countries may have different data protection laws. We ensure appropriate safeguards are in place to
              protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Compliance with Health Privacy Laws</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">10.1 HIPAA Compliance</h3>
            <p className="text-muted-foreground leading-relaxed">
              While HealthInsights is not a covered entity under HIPAA, we implement HIPAA-level security and privacy
              practices to protect your health information.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">10.2 GDPR Compliance (EU Users)</h3>
            <p className="text-muted-foreground leading-relaxed">
              For users in the European Union, we comply with the General Data Protection Regulation (GDPR), including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Lawful basis for processing (consent, legitimate interest)</li>
              <li>Data minimization and purpose limitation</li>
              <li>Right to access, rectification, erasure, and portability</li>
              <li>Data breach notification within 72 hours</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">10.3 CCPA Compliance (California Users)</h3>
            <p className="text-muted-foreground leading-relaxed">
              California residents have additional rights under the California Consumer Privacy Act (CCPA), including
              the right to know what personal information is collected and the right to opt-out of sale (note: we do not
              sell personal information).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. Cookies & Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Maintain your session and authentication</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns (anonymized)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You can control cookies through your browser settings, but disabling essential cookies may affect
              functionality.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">12. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.
              We will notify you of significant changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Posting the updated policy with a new "Last Updated" date</li>
              <li>Sending an email notification (for material changes)</li>
              <li>Displaying an in-app notification</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Continued use of the Service after changes constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">13. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please
              contact us:
            </p>
            <div className="bg-muted/50 p-4 rounded-md mt-4 space-y-2">
              <p className="text-muted-foreground">
                <strong>Email:</strong> privacy@healthinsights.app
              </p>
              <p className="text-muted-foreground">
                <strong>Support:</strong> support@healthinsights.app
              </p>
              <p className="text-muted-foreground">
                <strong>Data Protection Officer:</strong> dpo@healthinsights.app
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">14. Garmin-Specific Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Purpose of Garmin Integration:</strong> We use the Garmin Health API to retrieve your activity,
              sleep, heart rate, stress, and body composition data to provide comprehensive health insights by
              correlating wearable data with your laboratory test results.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Data Minimization:</strong> We only request and store the minimum necessary data from Garmin to
              provide our core service functionality.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>User Control:</strong> You have complete control over your Garmin connection and can disconnect at
              any time through the Wearables settings page. Disconnecting will stop all future data synchronization.
            </p>
          </section>

          <footer className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground">
              By using HealthInsights, you acknowledge that you have read and understood this Privacy Policy and agree
              to its terms.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Last Updated:</strong> December 9, 2024
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default Policy;
