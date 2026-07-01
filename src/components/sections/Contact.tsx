import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import data from '../../data/data.json';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const email = data.siteConfig.email?.trim();

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the email is still visible/selectable.
    }
  };

  return (
    <section
      id="contact"
      className="py-32 relative overflow-hidden"
      style={{ background: 'var(--color-space-near)' }}
    >
      {/* Contact atmosphere — accent glow from below */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 120%, rgba(255,61,0,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 100% 40% at 50% 0%,  rgba(80,120,255,0.04) 0%, transparent 60%)
          `,
        }}
      />
      {/* Noise for texture consistency */}
      <div className="absolute inset-0 env-noise pointer-events-none" style={{ opacity: 0.02 }} />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {data.siteConfig.availability && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 mb-8 glass-light px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent ambient-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs tracking-widest uppercase text-foreground/80">
              {data.siteConfig.availability}
            </span>
          </motion.div>
        )}

        <SectionHeading title="Contact" subtitle="Let's Create Something Together" index={4} />

        {/* Primary CTA — large email hero text, copy on click */}
        {email && (
          <motion.button
            type="button"
            onClick={copyEmail}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative block w-full text-left mb-16 -mt-6 cursor-pointer"
            aria-label="Copy email address"
          >
            <span
              className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display tracking-tight break-all text-foreground group-hover:text-accent transition-colors duration-300"
              style={{ textShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
            >
              {email}
            </span>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {copied ? (
                <>
                  <Check size={14} className="text-accent" /> Copied to clipboard
                </>
              ) : (
                <>
                  <Copy size={14} /> Click to copy
                </>
              )}
            </span>
          </motion.button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-8 md:mt-16 items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-base md:text-lg text-muted-foreground leading-relaxed max-w-md"
          >
            Have a project in mind? Let's talk about your vision. Reach me on your preferred platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3"
          >
            {[
              { label: 'Instagram →', href: data.siteConfig.social.instagram },
              { label: 'Facebook →', href: data.siteConfig.social.facebook },
              { label: 'Zalo →', href: data.siteConfig.social.zalo },
            ].map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-none py-5 justify-between glass-light hover:glass transition-all duration-300"
                >
                  {label}
                </Button>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
