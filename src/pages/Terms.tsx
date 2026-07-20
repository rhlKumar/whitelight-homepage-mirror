import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">
              <strong>Effective Date:</strong> December 9, 2024
              <br />
              <strong>Last Updated:</strong> December 9, 2024
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Chirayu App. These Terms of Service ("Terms") govern your access to and use of our health
              tracking and analysis application, website, and services (collectively, the "Service"). By accessing or
              using the Service, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>If you do not agree to these Terms, you may not access or use the Service.</strong>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">Chirayu App provides a digital platform that:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Analyzes uploaded health reports and laboratory test results</li>
              <li>
                Integrates with wearable devices (including Garmin smartwatches) to collect activity, sleep, heart rate,
                and other health metrics
              </li>
              <li>Generates AI-powered health insights and personalized recommendations</li>
              <li>Tracks health trends over time</li>
              <li>Provides visualizations correlating lifestyle factors with health markers</li>
              <li>Offers an AI-powered chat interface for health-related questions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 18 years old to use the Service. By agreeing to these Terms, you represent and
              warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>You will provide accurate and complete information</li>
              <li>You will comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Account Registration & Security</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">4.1 Account Creation</h3>
            <p className="text-muted-foreground leading-relaxed">
              To access certain features of the Service, you must create an account by providing:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Valid email address</li>
              <li>Authentication via Google OAuth or other supported methods</li>
              <li>Any additional information requested during registration</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">4.2 Account Security</h3>
            <p className="text-muted-foreground leading-relaxed">You are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access or security breach</li>
              <li>Ensuring your account information remains accurate and current</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">4.3 Account Termination</h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account if you violate these Terms or engage in
              fraudulent, abusive, or illegal activities.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Medical Disclaimer & Limitations</h2>

            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-destructive">IMPORTANT: NOT MEDICAL ADVICE</h3>

              <p className="text-muted-foreground leading-relaxed">
                <strong>
                  Chirayu App is NOT a substitute for professional medical advice, diagnosis, or treatment.
                </strong>{" "}
                The Service is designed for informational and educational purposes only.
              </p>

              <div className="space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  <strong>You acknowledge and agree that:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    The insights, recommendations, and analyses provided are based on algorithms and AI models that may
                    not account for your complete medical history or individual circumstances
                  </li>
                  <li>The Service does not diagnose, treat, cure, or prevent any disease or medical condition</li>
                  <li>
                    You should always consult with qualified healthcare professionals before making health-related
                    decisions
                  </li>
                  <li>
                    You should never disregard professional medical advice or delay seeking it because of information
                    provided by the Service
                  </li>
                  <li>In case of a medical emergency, call emergency services immediately</li>
                  <li>
                    The Service is not intended to replace regular check-ups or consultations with your healthcare
                    provider
                  </li>
                </ul>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                <strong>Use at Your Own Risk:</strong> Any action you take based on information from Chirayu App is
                strictly at your own risk. We shall not be liable for any decisions you make based on the Service.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Wearable Device Integration</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">6.1 Third-Party Services</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Service integrates with third-party wearable device platforms (such as Garmin). By connecting your
              wearable device:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You authorize us to access and retrieve your health data from the wearable platform</li>
              <li>You acknowledge that the wearable platform's terms and privacy policies also apply</li>
              <li>
                You understand that we are not responsible for the accuracy of data provided by third-party devices
              </li>
              <li>You can disconnect your wearable device at any time through the Service settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">6.2 Data Accuracy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Wearable device data may contain inaccuracies due to device limitations, sensor errors, or user factors.
              We make no warranties regarding the accuracy, completeness, or reliability of wearable device data.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">6.3 Compliance with Device Terms</h3>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for complying with all terms and conditions of your wearable device provider,
              including Garmin's terms of service and API usage policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. User Responsibilities & Acceptable Use</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">7.1 Prohibited Activities</h3>
            <p className="text-muted-foreground leading-relaxed">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Upload false, misleading, or inaccurate health information</li>
              <li>Share your account with others or create multiple accounts</li>
              <li>Attempt to gain unauthorized access to the Service or other users' accounts</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Scrape, data mine, or extract data from the Service using automated tools</li>
              <li>Transmit viruses, malware, or any harmful code</li>
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Use the Service to provide medical advice to others</li>
              <li>Interfere with or disrupt the Service or servers</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">7.2 Content You Upload</h3>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of health reports and data you upload. By uploading content, you grant us a license
              to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Store, process, and analyze your data to provide the Service</li>
              <li>Use anonymized, de-identified data for research and service improvement (with your consent)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You represent that you have the right to upload all content and that it does not violate any laws or
              third-party rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">8.1 Our Property</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Service, including all content, features, functionality, software, algorithms, user interface, design,
              trademarks, and logos, are owned by Chirayu App and protected by intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">8.2 Limited License</h3>
            <p className="text-muted-foreground leading-relaxed">
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service
              for personal, non-commercial purposes, subject to these Terms.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">8.3 Restrictions</h3>
            <p className="text-muted-foreground leading-relaxed">
              You may not copy, modify, distribute, sell, or lease any part of the Service without our express written
              permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Fees & Payment Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Chirayu App may offer both free and paid subscription plans. If you subscribe to a paid plan:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Billing:</strong> You authorize us to charge your payment method for applicable fees
              </li>
              <li>
                <strong>Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal
                date
              </li>
              <li>
                <strong>Price Changes:</strong> We may change pricing with 30 days' advance notice
              </li>
              <li>
                <strong>Refunds:</strong> Refund policies will be clearly stated at the time of purchase
              </li>
              <li>
                <strong>Taxes:</strong> You are responsible for any applicable taxes
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Failure to pay may result in suspension or termination of your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">10. Privacy & Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Our collection, use, and protection of your personal information is
              governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p className="text-muted-foreground leading-relaxed">Key points:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>We use industry-standard security measures to protect your data</li>
              <li>We do not sell your personal health information</li>
              <li>You have rights to access, correct, and delete your data</li>
              <li>We comply with applicable data protection laws (GDPR, CCPA, etc.)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">11. AI-Generated Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service uses artificial intelligence and machine learning to generate insights and recommendations.
              You acknowledge that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>AI-generated content may contain errors, inaccuracies, or hallucinations</li>
              <li>AI models are trained on general data and may not apply to your specific situation</li>
              <li>AI-generated insights are probabilistic and should not be treated as definitive medical advice</li>
              <li>We continuously improve our AI models but cannot guarantee 100% accuracy</li>
              <li>You should verify important information with qualified healthcare professionals</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">12. Disclaimers & Warranties</h2>

            <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed uppercase font-semibold">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                IMPLIED.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                <strong>We disclaim all warranties, including but not limited to:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                <li>Warranties regarding accuracy, reliability, or completeness of content</li>
                <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
                <li>Warranties regarding the results obtained from using the Service</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">We do not warrant that:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>The Service will meet your requirements or expectations</li>
                <li>Data from wearable devices will be accurate or complete</li>
                <li>AI-generated insights will be correct or applicable to your situation</li>
                <li>The Service will be free from bugs, viruses, or security vulnerabilities</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">13. Limitation of Liability</h2>

            <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed uppercase font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHIRAYU APP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                <strong>This includes liability for:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Personal injury, illness, or death resulting from reliance on the Service</li>
                <li>Medical decisions made based on information from the Service</li>
                <li>Inaccurate data from wearable devices or uploaded reports</li>
                <li>Errors in AI-generated insights or recommendations</li>
                <li>Service interruptions, data loss, or security breaches</li>
                <li>Actions or omissions of third-party service providers (e.g., Garmin)</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed">
                <strong>
                  Our total liability to you for all claims arising from or related to the Service shall not exceed the
                  greater of:
                </strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>The amount you paid us in the 12 months prior to the claim, or</li>
                <li>$100 USD</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">14. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless Chirayu App, its officers, directors, employees, and
              agents from any claims, liabilities, damages, losses, costs, or expenses (including legal fees) arising
              from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Your violation of these Terms</li>
              <li>Your misuse of the Service</li>
              <li>Your violation of any law or third-party rights</li>
              <li>Content you upload or submit</li>
              <li>Your connection of third-party devices or services</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">15. Third-Party Links & Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service may contain links to third-party websites, services, or wearable device platforms. We are not
              responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>The content, accuracy, or practices of third-party services</li>
              <li>Any damages or losses caused by third-party services</li>
              <li>The availability or performance of third-party integrations</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Your use of third-party services is governed by their respective terms and policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">16. Termination</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">16.1 By You</h3>
            <p className="text-muted-foreground leading-relaxed">
              You may terminate your account at any time by contacting us or using the account deletion feature in the
              Service.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">16.2 By Us</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may suspend or terminate your account immediately if:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You violate these Terms</li>
              <li>You engage in fraudulent or illegal activity</li>
              <li>You fail to pay applicable fees</li>
              <li>We are required to do so by law</li>
              <li>Continuing to provide the Service would create a legal or security risk</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-4">16.3 Effect of Termination</h3>
            <p className="text-muted-foreground leading-relaxed">Upon termination:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Your right to access the Service immediately ceases</li>
              <li>We may delete your account and data in accordance with our Privacy Policy</li>
              <li>You remain liable for any outstanding fees or obligations</li>
              <li>Sections of these Terms that should survive termination will remain in effect</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">17. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. If we make material changes, we will:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Update the "Last Updated" date at the top of these Terms</li>
              <li>Notify you via email or in-app notification</li>
              <li>Provide at least 30 days' notice for material changes</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Your continued use of the Service after changes take effect constitutes acceptance of the updated Terms.
              If you do not agree to the changes, you must stop using the Service and terminate your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">18. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">18.1 Informal Resolution</h3>
            <p className="text-muted-foreground leading-relaxed">
              Before pursuing formal legal action, you agree to contact us to attempt to resolve any dispute informally.
              We will work in good faith to resolve the issue within 60 days.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">18.2 Arbitration Agreement</h3>
            <p className="text-muted-foreground leading-relaxed">
              If informal resolution fails, any dispute shall be resolved through binding arbitration rather than in
              court, except that you may assert claims in small claims court if they qualify.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Arbitration will be conducted by a neutral arbitrator in accordance with applicable arbitration rules. The
              arbitrator's decision will be final and binding.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">18.3 Class Action Waiver</h3>
            <p className="text-muted-foreground leading-relaxed">
              You agree to resolve disputes with us only on an individual basis and waive your right to participate in
              class actions, class arbitrations, or representative actions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">19. Governing Law & Jurisdiction</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without
              regard to its conflict of law provisions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Any legal action or proceeding arising under these Terms will be brought exclusively in the courts located
              in [Your Jurisdiction], and you consent to personal jurisdiction in such courts.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">20. General Provisions</h2>

            <h3 className="text-xl font-semibold text-foreground mt-4">20.1 Entire Agreement</h3>
            <p className="text-muted-foreground leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Chirayu App
              regarding the Service.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">20.2 Severability</h3>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full
              force and effect.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">20.3 Waiver</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our failure to enforce any right or provision of these Terms does not constitute a waiver of that right or
              provision.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">20.4 Assignment</h3>
            <p className="text-muted-foreground leading-relaxed">
              You may not assign or transfer these Terms or your account without our written consent. We may assign
              these Terms without restriction.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">20.5 Force Majeure</h3>
            <p className="text-muted-foreground leading-relaxed">
              We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable
              control, including natural disasters, war, terrorism, pandemics, or internet/telecommunications failures.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-4">20.6 Export Controls</h3>
            <p className="text-muted-foreground leading-relaxed">
              You agree to comply with all applicable export and import laws and regulations in your use of the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">21. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms or need to contact us regarding the Service:
            </p>
            <div className="bg-muted/50 p-4 rounded-md mt-4 space-y-2">
              <p className="text-muted-foreground">
                <strong>Email:</strong> rahulkumar.iitb@gmail.com
              </p>
            </div>
          </section>

          <footer className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground">
              By creating an account or using Chirayu app, you acknowledge that you have read, understood, and agree to
              be bound by these Terms of Service.
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

export default Terms;
