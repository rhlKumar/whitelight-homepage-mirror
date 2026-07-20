import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Heart, ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const apps = [
  {
    id: "chirayu",
    name: "Chirayu AI",
    tagline: "Your AI-powered health insights companion",
    description:
      "Upload blood reports, get personalized health analysis powered by AI. Track markers, discover supplement recommendations, and chat with an AI health assistant.",
    icon: Activity,
    gradient: "from-[hsl(178,58%,42%)] to-[hsl(180,60%,45%)]",
    bgGlow: "hsl(178 58% 42% / 0.08)",
    route: "/auth",
    cta: "Open App",
    platform: "Web App",
  },
  {
    id: "pulsecheck",
    name: "PulseCheck",
    tagline: "Heart Rate & HRV Stress Tracker",
    description:
      "Measure heart rate, HRV, and stress state in 60 seconds using just your phone camera. No wearable needed. Free, private, and brutally honest.",
    icon: Heart,
    gradient: "from-[hsl(0,85%,58%)] to-[hsl(340,80%,55%)]",
    bgGlow: "hsl(0 85% 58% / 0.08)",
    route: "https://apps.apple.com/in/app/pulsecheck-heart-rate-monitor/id6759451200",
    cta: "Download on App Store",
    platform: "iOS App",
    external: true,
  },
];

const comingSoon = [
  { name: "Sleep Intelligence", emoji: "🌙" },
  { name: "Nutrition Tracker", emoji: "🥗" },
  { name: "Mental Wellness", emoji: "🧠" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">WhiteLight Ventures</span>
          </div>
          <a
            href="mailto:hello@whitelightventures.com"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 pb-20 pt-24 text-center md:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
        >
          WhiteLight Ventures LLP
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
        >
          Building the future of{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            personal health
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
        >
          We craft intelligent apps that help you understand, monitor, and improve your health — simply and privately.
        </motion.p>
      </section>

      {/* Apps */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          {apps.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={app.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
              >
                <Card
                  className="group relative overflow-hidden border-border/60 bg-card transition-all duration-300 hover:shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${app.bgGlow}, transparent 60%)` }}
                >
                  <CardContent className="flex flex-col gap-6 p-8">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${app.gradient} text-white shadow-md`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {app.platform}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{app.name}</h2>
                      <p className="mt-1 text-sm font-medium text-muted-foreground">{app.tagline}</p>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">{app.description}</p>

                    <Button
                      className="mt-auto w-full gap-2"
                      size="lg"
                      onClick={() => {
                        if (app.external) {
                          window.open(app.route, "_blank");
                        } else {
                          navigate(app.route);
                        }
                      }}
                    >
                      {app.cta}
                      {app.external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="border-t bg-muted/40 py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-2 text-2xl font-bold tracking-tight"
          >
            Coming Soon
          </motion.h2>
          <p className="mb-10 text-sm text-muted-foreground">More apps on the way</p>

          <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-4">
            {comingSoon.map((item, i) => (
              <motion.div
                key={item.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium shadow-sm"
              >
                <span className="text-lg">{item.emoji}</span>
                {item.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} WhiteLight Ventures LLP. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/pulsecheck/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="/pulsecheck/terms" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
